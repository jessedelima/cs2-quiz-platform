const express = require('express');
const passport = require('passport');
const { requireAuth } = require('../middleware/passport');
const router = express.Router();

// Rota para iniciar autenticação Steam
router.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
    // Esta função não será chamada, pois o Steam redirecionará
});

// Rota de retorno do Steam
router.get('/steam/return', 
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        // Autenticação bem-sucedida
        console.log('Usuário autenticado:', req.user.username);
        res.redirect('/dashboard');
    }
);

// Rota para logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao fazer logout'
            });
        }
        
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao destruir sessão'
                });
            }
            
            res.json({
                success: true,
                message: 'Logout realizado com sucesso'
            });
        });
    });
});

// Rota para verificar status de autenticação
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            authenticated: true,
            user: req.user.toJSON()
        });
    } else {
        res.json({
            success: true,
            authenticated: false,
            user: null
        });
    }
});

// Rota para obter perfil do usuário
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const stats = await req.user.getStats();
        const gameHistory = await req.user.getGameHistory(5);
        
        res.json({
            success: true,
            user: req.user.toJSON(),
            stats: stats,
            recentGames: gameHistory
        });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar perfil do usuário'
        });
    }
});

module.exports = router;