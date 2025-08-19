const express = require('express');
const { requireAuth } = require('../middleware/passport');
const steamBot = require('../utils/steamBot');
const database = require('../models/database');
const User = require('../models/User');
const router = express.Router();

// Iniciar depósito de skin
router.post('/deposit', requireAuth, async (req, res) => {
    try {
        const { steamTradeUrl, minValue } = req.body;

        // Validações
        if (!steamTradeUrl) {
            return res.status(400).json({
                success: false,
                message: 'URL de troca do Steam é obrigatória'
            });
        }

        const minSkinValue = minValue || parseFloat(await database.getSetting('min_skin_value')) || 1.0;

        // Extrair Steam ID da URL de troca
        const steamIdMatch = steamTradeUrl.match(/partner=(\d+)/);
        if (!steamIdMatch) {
            return res.status(400).json({
                success: false,
                message: 'URL de troca inválida'
            });
        }

        const steamId32 = steamIdMatch[1];
        const steamId64 = (BigInt(steamId32) + BigInt('76561197960265728')).toString();

        // Verificar se o Steam ID corresponde ao usuário logado
        if (steamId64 !== req.user.steam_id) {
            return res.status(400).json({
                success: false,
                message: 'URL de troca não corresponde à sua conta Steam'
            });
        }

        // Criar transação no banco de dados
        const transactionResult = await database.run(
            `INSERT INTO skin_transactions (user_id, type, skin_value, status)
             VALUES (?, 'deposit', ?, 'pending')`,
            [req.user.id, minSkinValue]
        );

        try {
            // Criar oferta de troca
            const tradeOffer = await steamBot.createDepositOffer(steamId64, minSkinValue);

            // Atualizar transação com ID da oferta
            await database.run(
                'UPDATE skin_transactions SET steam_trade_id = ?, skin_name = ? WHERE id = ?',
                [tradeOffer.offerId, tradeOffer.items[0]?.market_hash_name || 'Item', transactionResult.id]
            );

            res.json({
                success: true,
                message: 'Oferta de depósito criada com sucesso',
                tradeOffer: {
                    id: tradeOffer.offerId,
                    url: tradeOffer.tradeUrl,
                    estimatedValue: tradeOffer.estimatedValue,
                    items: tradeOffer.items
                },
                transactionId: transactionResult.id
            });
        } catch (tradeError) {
            // Marcar transação como falha
            await database.run(
                'UPDATE skin_transactions SET status = ? WHERE id = ?',
                ['failed', transactionResult.id]
            );
            throw tradeError;
        }
    } catch (error) {
        console.error('Erro ao criar depósito:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erro ao processar depósito de skin'
        });
    }
});

// Iniciar saque de skin
router.post('/withdraw', requireAuth, async (req, res) => {
    try {
        const { steamTradeUrl, items, totalValue } = req.body;

        // Validações
        if (!steamTradeUrl || !items || !totalValue) {
            return res.status(400).json({
                success: false,
                message: 'Dados incompletos para saque'
            });
        }

        if (req.user.balance < totalValue) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para este saque'
            });
        }

        // Extrair Steam ID da URL de troca
        const steamIdMatch = steamTradeUrl.match(/partner=(\d+)/);
        if (!steamIdMatch) {
            return res.status(400).json({
                success: false,
                message: 'URL de troca inválida'
            });
        }

        const steamId32 = steamIdMatch[1];
        const steamId64 = (BigInt(steamId32) + BigInt('76561197960265728')).toString();

        // Verificar se o Steam ID corresponde ao usuário logado
        if (steamId64 !== req.user.steam_id) {
            return res.status(400).json({
                success: false,
                message: 'URL de troca não corresponde à sua conta Steam'
            });
        }

        // Debitar saldo do usuário
        await req.user.updateBalance(totalValue, 'subtract');

        // Criar transação no banco de dados
        const transactionResult = await database.run(
            `INSERT INTO skin_transactions (user_id, type, skin_value, status)
             VALUES (?, 'withdrawal', ?, 'pending')`,
            [req.user.id, totalValue]
        );

        try {
            // Criar oferta de troca
            const tradeOffer = await steamBot.createWithdrawalOffer(steamId64, items);

            // Atualizar transação com ID da oferta
            await database.run(
                'UPDATE skin_transactions SET steam_trade_id = ?, skin_name = ? WHERE id = ?',
                [tradeOffer.offerId, items.map(i => i.market_hash_name).join(', '), transactionResult.id]
            );

            res.json({
                success: true,
                message: 'Oferta de saque criada com sucesso',
                tradeOffer: {
                    id: tradeOffer.offerId,
                    url: tradeOffer.tradeUrl,
                    items: tradeOffer.items
                },
                transactionId: transactionResult.id,
                newBalance: req.user.balance
            });
        } catch (tradeError) {
            // Reembolsar usuário em caso de erro
            await req.user.updateBalance(totalValue, 'add');
            
            // Marcar transação como falha
            await database.run(
                'UPDATE skin_transactions SET status = ? WHERE id = ?',
                ['failed', transactionResult.id]
            );
            throw tradeError;
        }
    } catch (error) {
        console.error('Erro ao criar saque:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erro ao processar saque de skin'
        });
    }
});

// Verificar status de transação
router.get('/transaction/:id/status', requireAuth, async (req, res) => {
    try {
        const transaction = await database.get(
            'SELECT * FROM skin_transactions WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transação não encontrada'
            });
        }

        let offerStatus = null;
        if (transaction.steam_trade_id) {
            try {
                offerStatus = await steamBot.getOfferStatus(transaction.steam_trade_id);
            } catch (error) {
                console.error('Erro ao obter status da oferta:', error);
            }
        }

        res.json({
            success: true,
            transaction: {
                id: transaction.id,
                type: transaction.type,
                skinName: transaction.skin_name,
                skinValue: transaction.skin_value,
                status: transaction.status,
                createdAt: transaction.created_at,
                completedAt: transaction.completed_at,
                steamTradeId: transaction.steam_trade_id
            },
            offerStatus: offerStatus
        });
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar status da transação'
        });
    }
});

// Listar transações do usuário
router.get('/transactions', requireAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const transactions = await database.all(
            `SELECT * FROM skin_transactions 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [req.user.id, limit, offset]
        );

        const total = await database.get(
            'SELECT COUNT(*) as count FROM skin_transactions WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            success: true,
            transactions: transactions,
            pagination: {
                page: page,
                limit: limit,
                total: total.count,
                totalPages: Math.ceil(total.count / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar histórico de transações'
        });
    }
});

// Obter inventário disponível para saque
router.get('/inventory', requireAuth, async (req, res) => {
    try {
        // Obter inventário do bot
        const inventory = await steamBot.getBotInventory();
        
        // Filtrar e formatar itens
        const availableItems = inventory
            .filter(item => item.tradable)
            .map(item => ({
                id: item.id,
                name: item.market_hash_name,
                iconUrl: item.getImageURL(),
                estimatedValue: 0, // Será preenchido via API de preços
                rarity: item.tags?.find(tag => tag.category === 'Rarity')?.name || 'Unknown',
                condition: item.tags?.find(tag => tag.category === 'Exterior')?.name || 'Unknown'
            }));

        // Obter preços dos itens (limitado para performance)
        const itemsWithPrices = await Promise.all(
            availableItems.slice(0, 50).map(async (item) => {
                try {
                    const price = await steamBot.getItemValue(item.name);
                    return { ...item, estimatedValue: price };
                } catch (error) {
                    return { ...item, estimatedValue: 0 };
                }
            })
        );

        res.json({
            success: true,
            inventory: itemsWithPrices.sort((a, b) => b.estimatedValue - a.estimatedValue),
            totalItems: inventory.length
        });
    } catch (error) {
        console.error('Erro ao obter inventário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar inventário disponível'
        });
    }
});

// Obter preço de um item específico
router.get('/price/:itemName', async (req, res) => {
    try {
        const itemName = decodeURIComponent(req.params.itemName);
        const price = await steamBot.getItemValue(itemName);
        
        res.json({
            success: true,
            itemName: itemName,
            price: price,
            currency: 'USD'
        });
    } catch (error) {
        console.error('Erro ao obter preço:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter preço do item'
        });
    }
});

// Cancelar transação pendente
router.post('/transaction/:id/cancel', requireAuth, async (req, res) => {
    try {
        const transaction = await database.get(
            'SELECT * FROM skin_transactions WHERE id = ? AND user_id = ? AND status = ?',
            [req.params.id, req.user.id, 'pending']
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transação não encontrada ou não pode ser cancelada'
            });
        }

        // Se for saque, reembolsar o usuário
        if (transaction.type === 'withdrawal') {
            await req.user.updateBalance(transaction.skin_value, 'add');
        }

        // Marcar como cancelada
        await database.run(
            'UPDATE skin_transactions SET status = ? WHERE id = ?',
            ['cancelled', transaction.id]
        );

        res.json({
            success: true,
            message: 'Transação cancelada com sucesso',
            newBalance: req.user.balance
        });
    } catch (error) {
        console.error('Erro ao cancelar transação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao cancelar transação'
        });
    }
});

module.exports = router;