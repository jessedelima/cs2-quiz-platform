const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const database = require('../models/database');

class SteamBot {
    constructor() {
        this.client = new SteamUser();
        this.community = new SteamCommunity();
        this.manager = new TradeOfferManager({
            steam: this.client,
            community: this.community,
            language: 'pt'
        });
        
        this.isLoggedIn = false;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Login events
        this.client.on('loggedOn', () => {
            console.log('✅ Steam Bot logado com sucesso');
            this.isLoggedIn = true;
            this.client.setPersona(SteamUser.EPersonaState.Online);
            this.client.gamesPlayed([730]); // CS2 App ID
        });

        this.client.on('error', (err) => {
            console.error('❌ Erro no Steam Bot:', err);
            this.isLoggedIn = false;
        });

        // Web session events
        this.client.on('webSession', (sessionid, cookies) => {
            this.manager.setCookies(cookies);
            this.community.setCookies(cookies);
            this.community.startConfirmationChecker(10000, process.env.STEAM_BOT_IDENTITY_SECRET);
        });

        // Trade offer events
        this.manager.on('newOffer', (offer) => {
            console.log(`Nova oferta de troca recebida de ${offer.partner.getSteamID64()}`);
            this.handleIncomingOffer(offer);
        });

        this.manager.on('sentOfferChanged', (offer, oldState) => {
            console.log(`Oferta ${offer.id} mudou de estado: ${oldState} -> ${offer.state}`);
            this.handleOfferStateChange(offer, oldState);
        });

        this.manager.on('receivedOfferChanged', (offer, oldState) => {
            console.log(`Oferta recebida ${offer.id} mudou de estado: ${oldState} -> ${offer.state}`);
            this.handleOfferStateChange(offer, oldState);
        });
    }

    // Fazer login no Steam
    async login() {
        try {
            const logOnOptions = {
                accountName: process.env.STEAM_BOT_USERNAME,
                password: process.env.STEAM_BOT_PASSWORD,
                twoFactorCode: SteamUser.getAuthCode(process.env.STEAM_BOT_SHARED_SECRET)
            };

            this.client.logOn(logOnOptions);
            
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout no login do Steam'));
                }, 30000);

                this.client.once('loggedOn', () => {
                    clearTimeout(timeout);
                    resolve();
                });

                this.client.once('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            });
        } catch (error) {
            console.error('Erro ao fazer login no Steam:', error);
            throw error;
        }
    }

    // Criar oferta de troca para receber skins
    async createDepositOffer(steamId64, minValue) {
        try {
            if (!this.isLoggedIn) {
                throw new Error('Bot não está logado no Steam');
            }

            const offer = this.manager.createOffer(steamId64);
            
            // Obter inventário do usuário
            const inventory = await this.getUserInventory(steamId64);
            
            if (!inventory || inventory.length === 0) {
                throw new Error('Usuário não possui itens no inventário');
            }

            // Filtrar itens válidos (CS2 skins com valor mínimo)
            const validItems = await this.filterValidItems(inventory, minValue);
            
            if (validItems.length === 0) {
                throw new Error(`Nenhum item encontrado com valor mínimo de $${minValue}`);
            }

            // Adicionar itens à oferta (pegar o primeiro item válido)
            offer.addTheirItems(validItems.slice(0, 1));
            
            // Definir mensagem da oferta
            offer.setMessage(`Depósito CS2 Quiz Platform - Valor mínimo: $${minValue}`);

            // Enviar oferta
            const sentOffer = await this.sendOffer(offer);
            
            return {
                offerId: sentOffer.id,
                tradeUrl: `https://steamcommunity.com/tradeoffer/${sentOffer.id}/`,
                items: validItems.slice(0, 1),
                estimatedValue: validItems[0].value
            };
        } catch (error) {
            console.error('Erro ao criar oferta de depósito:', error);
            throw error;
        }
    }

    // Criar oferta de troca para enviar skins
    async createWithdrawalOffer(steamId64, items) {
        try {
            if (!this.isLoggedIn) {
                throw new Error('Bot não está logado no Steam');
            }

            const offer = this.manager.createOffer(steamId64);
            
            // Obter nosso inventário
            const ourInventory = await this.getBotInventory();
            
            // Encontrar itens solicitados no nosso inventário
            const itemsToSend = [];
            for (const requestedItem of items) {
                const foundItem = ourInventory.find(item => 
                    item.market_hash_name === requestedItem.market_hash_name
                );
                
                if (foundItem) {
                    itemsToSend.push(foundItem);
                }
            }

            if (itemsToSend.length === 0) {
                throw new Error('Itens solicitados não encontrados no inventário do bot');
            }

            // Adicionar itens à oferta
            offer.addOurItems(itemsToSend);
            
            // Definir mensagem da oferta
            offer.setMessage('Saque CS2 Quiz Platform - Seus prêmios!');

            // Enviar oferta
            const sentOffer = await this.sendOffer(offer);
            
            return {
                offerId: sentOffer.id,
                tradeUrl: `https://steamcommunity.com/tradeoffer/${sentOffer.id}/`,
                items: itemsToSend
            };
        } catch (error) {
            console.error('Erro ao criar oferta de saque:', error);
            throw error;
        }
    }

    // Obter inventário do usuário
    async getUserInventory(steamId64) {
        return new Promise((resolve, reject) => {
            this.manager.getUserInventoryContents(steamId64, 730, 2, true, (err, inventory) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(inventory);
                }
            });
        });
    }

    // Obter inventário do bot
    async getBotInventory() {
        return new Promise((resolve, reject) => {
            this.manager.getInventoryContents(730, 2, true, (err, inventory) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(inventory);
                }
            });
        });
    }

    // Filtrar itens válidos com valor mínimo
    async filterValidItems(inventory, minValue) {
        const validItems = [];
        
        for (const item of inventory) {
            // Verificar se é um item tradeable
            if (!item.tradable) continue;
            
            // Obter valor do item
            const itemValue = await this.getItemValue(item.market_hash_name);
            
            if (itemValue >= minValue) {
                validItems.push({
                    ...item,
                    value: itemValue
                });
            }
        }

        // Ordenar por valor (maior primeiro)
        return validItems.sort((a, b) => b.value - a.value);
    }

    // Obter valor do item via API externa
    async getItemValue(marketHashName) {
        try {
            // Usar API do CSGOFloat ou similar para obter preços
            const response = await fetch(`https://api.csgofloat.com/v1/market/items?name=${encodeURIComponent(marketHashName)}`);
            const data = await response.json();
            
            if (data && data.price) {
                return parseFloat(data.price);
            }
            
            return 0;
        } catch (error) {
            console.error('Erro ao obter valor do item:', error);
            return 0;
        }
    }

    // Enviar oferta de troca
    async sendOffer(offer) {
        return new Promise((resolve, reject) => {
            offer.send((err, status) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Oferta enviada com status: ${status}`);
                    resolve(offer);
                }
            });
        });
    }

    // Lidar com ofertas recebidas
    async handleIncomingOffer(offer) {
        try {
            // Verificar se é uma oferta válida
            if (offer.itemsToGive.length === 0 && offer.itemsToReceive.length > 0) {
                // Oferta de depósito - aceitar automaticamente se válida
                const isValid = await this.validateDepositOffer(offer);
                
                if (isValid) {
                    offer.accept((err) => {
                        if (err) {
                            console.error('Erro ao aceitar oferta:', err);
                        } else {
                            console.log(`Oferta ${offer.id} aceita automaticamente`);
                        }
                    });
                } else {
                    offer.decline((err) => {
                        if (err) {
                            console.error('Erro ao recusar oferta:', err);
                        } else {
                            console.log(`Oferta ${offer.id} recusada - não atende aos critérios`);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao processar oferta recebida:', error);
        }
    }

    // Validar oferta de depósito
    async validateDepositOffer(offer) {
        try {
            const minValue = parseFloat(await database.getSetting('min_skin_value')) || 1.0;
            
            for (const item of offer.itemsToReceive) {
                const itemValue = await this.getItemValue(item.market_hash_name);
                if (itemValue >= minValue) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao validar oferta:', error);
            return false;
        }
    }

    // Lidar com mudanças de estado das ofertas
    async handleOfferStateChange(offer, oldState) {
        try {
            // Atualizar status no banco de dados
            await database.run(
                'UPDATE skin_transactions SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE steam_trade_id = ?',
                [this.getStatusFromOfferState(offer.state), offer.id.toString()]
            );

            // Se a oferta foi aceita, processar o depósito
            if (offer.state === TradeOfferManager.ETradeOfferState.Accepted) {
                await this.processCompletedTrade(offer);
            }
        } catch (error) {
            console.error('Erro ao processar mudança de estado:', error);
        }
    }

    // Converter estado da oferta para status do banco
    getStatusFromOfferState(state) {
        switch (state) {
            case TradeOfferManager.ETradeOfferState.Active:
                return 'pending';
            case TradeOfferManager.ETradeOfferState.Accepted:
                return 'completed';
            case TradeOfferManager.ETradeOfferState.Declined:
            case TradeOfferManager.ETradeOfferState.Canceled:
                return 'cancelled';
            case TradeOfferManager.ETradeOfferState.InvalidItems:
            case TradeOfferManager.ETradeOfferState.CreatedNeedsConfirmation:
                return 'failed';
            default:
                return 'pending';
        }
    }

    // Processar troca completada
    async processCompletedTrade(offer) {
        try {
            // Encontrar transação no banco de dados
            const transaction = await database.get(
                'SELECT * FROM skin_transactions WHERE steam_trade_id = ?',
                [offer.id.toString()]
            );

            if (!transaction) {
                console.error('Transação não encontrada para oferta:', offer.id);
                return;
            }

            if (transaction.type === 'deposit') {
                // Processar depósito - adicionar valor ao saldo do usuário
                const totalValue = offer.itemsToReceive.reduce(async (sum, item) => {
                    const itemValue = await this.getItemValue(item.market_hash_name);
                    return sum + itemValue;
                }, 0);

                // Atualizar saldo do usuário
                await database.run(
                    'UPDATE users SET balance = balance + ? WHERE id = ?',
                    [totalValue, transaction.user_id]
                );

                console.log(`Depósito processado: $${totalValue} adicionado ao usuário ${transaction.user_id}`);
            }
        } catch (error) {
            console.error('Erro ao processar troca completada:', error);
        }
    }

    // Verificar status de uma oferta
    async getOfferStatus(offerId) {
        return new Promise((resolve, reject) => {
            this.manager.getOffer(offerId, (err, offer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: offer.id,
                        state: offer.state,
                        status: this.getStatusFromOfferState(offer.state),
                        created: offer.created,
                        updated: offer.updated
                    });
                }
            });
        });
    }
}

// Singleton instance
const steamBot = new SteamBot();

module.exports = steamBot;