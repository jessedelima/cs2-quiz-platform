const express = require('express');
const { requireAuth } = require('../middleware/passport');
const Lobby = require('../models/Lobby');
const User = require('../models/User');
const router = express.Router();

// Listar lobbies disponíveis
router.get('/available', async (req, res) => {
    try {
        const lobbies = await Lobby.getAvailableLobbies();
        
        res.json({
            success: true,
            lobbies: lobbies.map(lobby => lobby.toJSON())
        });
    } catch (error) {
        console.error('Erro ao listar lobbies:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar lobbies disponíveis'
        });
    }
});

// Obter detalhes de um lobby específico
router.get('/:id', async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.id);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        res.json({
            success: true,
            lobby: lobby.toJSON()
        });
    } catch (error) {
        console.error('Erro ao obter lobby:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar detalhes do lobby'
        });
    }
});

// Criar novo lobby
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { name, entryFee, maxPlayers } = req.body;

        // Validações
        if (!name || !entryFee) {
            return res.status(400).json({
                success: false,
                message: 'Nome e taxa de entrada são obrigatórios'
            });
        }

        if (entryFee < 0.1) {
            return res.status(400).json({
                success: false,
                message: 'Taxa de entrada mínima é $0.10'
            });
        }

        if (maxPlayers < 2 || maxPlayers > 20) {
            return res.status(400).json({
                success: false,
                message: 'Número de jogadores deve ser entre 2 e 20'
            });
        }

        // Verificar se o usuário tem saldo suficiente
        if (!req.user.canJoinLobby(entryFee)) {
            return res.status(400).json({
                success: false,
                message: 'Saldo insuficiente para criar este lobby'
            });
        }

        const lobby = await Lobby.create(name, entryFee, maxPlayers, req.user.id);
        
        // Adicionar o criador automaticamente ao lobby
        await lobby.addPlayer(req.user.id);

        res.json({
            success: true,
            message: 'Lobby criado com sucesso',
            lobby: lobby.toJSON()
        });
    } catch (error) {
        console.error('Erro ao criar lobby:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erro ao criar lobby'
        });
    }
});

// Entrar em um lobby
router.post('/:id/join', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.id);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        await lobby.addPlayer(req.user.id);

        // Emitir evento via Socket.IO para atualizar outros jogadores
        req.app.get('io').to(`lobby_${lobby.id}`).emit('playerJoined', {
            user: req.user.toJSON(),
            currentPlayers: lobby.current_players
        });

        res.json({
            success: true,
            message: 'Entrou no lobby com sucesso',
            lobby: lobby.toJSON()
        });
    } catch (error) {
        console.error('Erro ao entrar no lobby:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erro ao entrar no lobby'
        });
    }
});

// Sair de um lobby
router.post('/:id/leave', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.id);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        await lobby.removePlayer(req.user.id);

        // Emitir evento via Socket.IO
        req.app.get('io').to(`lobby_${lobby.id}`).emit('playerLeft', {
            userId: req.user.id,
            currentPlayers: lobby.current_players
        });

        res.json({
            success: true,
            message: 'Saiu do lobby com sucesso',
            lobby: lobby.toJSON()
        });
    } catch (error) {
        console.error('Erro ao sair do lobby:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erro ao sair do lobby'
        });
    }
});

// Iniciar lobby manualmente (apenas criador)
router.post('/:id/start', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.id);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        // Verificar se é o criador do lobby
        if (lobby.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Apenas o criador pode iniciar o lobby'
            });
        }

        await lobby.start();

        // Emitir evento para iniciar o quiz
        req.app.get('io').to(`lobby_${lobby.id}`).emit('gameStarted', {
            lobbyId: lobby.id,
            message: 'O quiz está começando!'
        });

        res.json({
            success: true,
            message: 'Lobby iniciado com sucesso',
            lobby: lobby.toJSON()
        });
    } catch (error) {
        console.error('Erro ao iniciar lobby:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erro ao iniciar lobby'
        });
    }
});

// Obter histórico de lobbies do usuário
router.get('/user/history', requireAuth, async (req, res) => {
    try {
        const history = await req.user.getGameHistory(20);
        
        res.json({
            success: true,
            history: history
        });
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar histórico de jogos'
        });
    }
});

module.exports = router;