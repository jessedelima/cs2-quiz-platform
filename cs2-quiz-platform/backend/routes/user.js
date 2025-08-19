const express = require('express');
const { requireAuth } = require('../middleware/passport');
const User = require('../models/User');
const database = require('../models/database');
const router = express.Router();

// Obter perfil completo do usuário
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const stats = await req.user.getStats();
        const gameHistory = await req.user.getGameHistory(10);
        
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

// Obter estatísticas detalhadas
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const stats = await req.user.getStats();
        
        // Estatísticas adicionais
        const additionalStats = await database.get(`
            SELECT 
                COUNT(DISTINCT ua.lobby_id) as quizzes_completed,
                AVG(ua.time_taken) as avg_response_time,
                COUNT(CASE WHEN ua.is_correct THEN 1 END) as total_correct,
                COUNT(*) as total_questions,
                MIN(ua.time_taken) as fastest_response,
                MAX(gh.final_score) as highest_score
            FROM user_answers ua
            LEFT JOIN game_history gh ON ua.lobby_id = gh.lobby_id AND ua.user_id = gh.user_id
            WHERE ua.user_id = ?
        `, [req.user.id]);

        // Estatísticas por categoria
        const categoryStats = await database.all(`
            SELECT 
                q.category,
                COUNT(*) as questions_answered,
                COUNT(CASE WHEN ua.is_correct THEN 1 END) as correct_answers,
                AVG(ua.time_taken) as avg_time
            FROM user_answers ua
            JOIN questions q ON ua.question_id = q.id
            WHERE ua.user_id = ?
            GROUP BY q.category
            ORDER BY correct_answers DESC
        `, [req.user.id]);

        // Estatísticas por dificuldade
        const difficultyStats = await database.all(`
            SELECT 
                q.difficulty,
                COUNT(*) as questions_answered,
                COUNT(CASE WHEN ua.is_correct THEN 1 END) as correct_answers,
                AVG(ua.time_taken) as avg_time
            FROM user_answers ua
            JOIN questions q ON ua.question_id = q.id
            WHERE ua.user_id = ?
            GROUP BY q.difficulty
            ORDER BY 
                CASE q.difficulty 
                    WHEN 'easy' THEN 1 
                    WHEN 'medium' THEN 2 
                    WHEN 'hard' THEN 3 
                END
        `, [req.user.id]);

        res.json({
            success: true,
            stats: {
                ...stats,
                quizzes_completed: additionalStats.quizzes_completed || 0,
                avg_response_time: Math.round(additionalStats.avg_response_time || 0),
                total_correct: additionalStats.total_correct || 0,
                total_questions: additionalStats.total_questions || 0,
                fastest_response: additionalStats.fastest_response || 0,
                highest_score: additionalStats.highest_score || 0,
                overall_accuracy: additionalStats.total_questions > 0 ? 
                    Math.round((additionalStats.total_correct / additionalStats.total_questions) * 100) : 0
            },
            categoryStats: categoryStats.map(cat => ({
                ...cat,
                accuracy: cat.questions_answered > 0 ? 
                    Math.round((cat.correct_answers / cat.questions_answered) * 100) : 0,
                avg_time: Math.round(cat.avg_time || 0)
            })),
            difficultyStats: difficultyStats.map(diff => ({
                ...diff,
                accuracy: diff.questions_answered > 0 ? 
                    Math.round((diff.correct_answers / diff.questions_answered) * 100) : 0,
                avg_time: Math.round(diff.avg_time || 0)
            }))
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar estatísticas detalhadas'
        });
    }
});

// Obter histórico de jogos
router.get('/history', requireAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const history = await database.all(`
            SELECT 
                gh.*,
                l.name as lobby_name,
                l.entry_fee,
                l.max_players
            FROM game_history gh
            JOIN lobbies l ON gh.lobby_id = l.id
            WHERE gh.user_id = ?
            ORDER BY gh.played_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, limit, offset]);

        const total = await database.get(
            'SELECT COUNT(*) as count FROM game_history WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            success: true,
            history: history,
            pagination: {
                page: page,
                limit: limit,
                total: total.count,
                totalPages: Math.ceil(total.count / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar histórico de jogos'
        });
    }
});

// Obter ranking/leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const type = req.query.type || 'earnings'; // earnings, wins, games
        const limit = parseInt(req.query.limit) || 50;

        let orderBy;
        switch (type) {
            case 'wins':
                orderBy = 'u.total_wins DESC, u.total_earnings DESC';
                break;
            case 'games':
                orderBy = 'u.total_games DESC, u.total_wins DESC';
                break;
            case 'winrate':
                orderBy = 'win_rate DESC, u.total_wins DESC';
                break;
            default:
                orderBy = 'u.total_earnings DESC, u.total_wins DESC';
        }

        const leaderboard = await database.all(`
            SELECT 
                u.id, u.username, u.avatar, u.total_wins, u.total_games, u.total_earnings,
                CASE WHEN u.total_games > 0 THEN (u.total_wins * 100.0 / u.total_games) ELSE 0 END as win_rate,
                COUNT(DISTINCT gh.lobby_id) as quizzes_completed,
                AVG(gh.final_score) as avg_score
            FROM users u
            LEFT JOIN game_history gh ON u.id = gh.user_id
            WHERE u.total_games > 0
            GROUP BY u.id
            ORDER BY ${orderBy}
            LIMIT ?
        `, [limit]);

        const userPosition = req.user ? await database.get(`
            SELECT COUNT(*) + 1 as position
            FROM users u
            WHERE u.total_earnings > ? AND u.total_games > 0
        `, [req.user.total_earnings]) : null;

        res.json({
            success: true,
            leaderboard: leaderboard.map((user, index) => ({
                position: index + 1,
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                total_wins: user.total_wins,
                total_games: user.total_games,
                total_earnings: user.total_earnings,
                win_rate: Math.round(user.win_rate),
                quizzes_completed: user.quizzes_completed,
                avg_score: Math.round(user.avg_score || 0)
            })),
            userPosition: userPosition ? userPosition.position : null,
            type: type
        });
    } catch (error) {
        console.error('Erro ao obter leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar ranking'
        });
    }
});

// Atualizar configurações do usuário
router.put('/settings', requireAuth, async (req, res) => {
    try {
        const { notifications, privacy, language } = req.body;

        // Por enquanto, apenas retornar sucesso
        // Em uma implementação completa, salvaria as configurações no banco
        
        res.json({
            success: true,
            message: 'Configurações atualizadas com sucesso',
            settings: {
                notifications: notifications || true,
                privacy: privacy || 'public',
                language: language || 'pt-BR'
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar configurações'
        });
    }
});

// Obter conquistas do usuário
router.get('/achievements', requireAuth, async (req, res) => {
    try {
        const stats = await req.user.getStats();
        
        // Definir conquistas baseadas nas estatísticas
        const achievements = [
            {
                id: 'first_win',
                name: 'Primeira Vitória',
                description: 'Vença seu primeiro quiz',
                icon: '🏆',
                unlocked: req.user.total_wins > 0,
                progress: Math.min(req.user.total_wins, 1),
                target: 1
            },
            {
                id: 'quiz_master',
                name: 'Mestre do Quiz',
                description: 'Vença 10 quizzes',
                icon: '👑',
                unlocked: req.user.total_wins >= 10,
                progress: Math.min(req.user.total_wins, 10),
                target: 10
            },
            {
                id: 'big_earner',
                name: 'Grande Ganhador',
                description: 'Ganhe $100 em prêmios',
                icon: '💰',
                unlocked: req.user.total_earnings >= 100,
                progress: Math.min(req.user.total_earnings, 100),
                target: 100
            },
            {
                id: 'accuracy_expert',
                name: 'Expert em Precisão',
                description: 'Mantenha 80% de precisão em 50+ perguntas',
                icon: '🎯',
                unlocked: stats.avg_accuracy >= 80 && stats.total_questions >= 50,
                progress: stats.total_questions >= 50 ? Math.min(stats.avg_accuracy, 80) : 0,
                target: 80
            },
            {
                id: 'speed_demon',
                name: 'Demônio da Velocidade',
                description: 'Responda uma pergunta em menos de 5 segundos',
                icon: '⚡',
                unlocked: stats.fastest_response > 0 && stats.fastest_response < 5,
                progress: stats.fastest_response > 0 ? Math.max(0, 5 - stats.fastest_response) : 0,
                target: 5
            },
            {
                id: 'dedicated_player',
                name: 'Jogador Dedicado',
                description: 'Jogue 50 quizzes',
                icon: '🎮',
                unlocked: req.user.total_games >= 50,
                progress: Math.min(req.user.total_games, 50),
                target: 50
            }
        ];

        res.json({
            success: true,
            achievements: achievements,
            unlockedCount: achievements.filter(a => a.unlocked).length,
            totalCount: achievements.length
        });
    } catch (error) {
        console.error('Erro ao obter conquistas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar conquistas'
        });
    }
});

// Obter atividade recente
router.get('/activity', requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Combinar diferentes tipos de atividade
        const gameActivity = await database.all(`
            SELECT 
                'game' as type,
                gh.played_at as timestamp,
                l.name as lobby_name,
                gh.final_position as position,
                gh.prize_won,
                gh.final_score
            FROM game_history gh
            JOIN lobbies l ON gh.lobby_id = l.id
            WHERE gh.user_id = ?
            ORDER BY gh.played_at DESC
            LIMIT ?
        `, [req.user.id, limit]);

        const transactionActivity = await database.all(`
            SELECT 
                'transaction' as type,
                st.created_at as timestamp,
                st.type as transaction_type,
                st.skin_value,
                st.status,
                st.skin_name
            FROM skin_transactions st
            WHERE st.user_id = ?
            ORDER BY st.created_at DESC
            LIMIT ?
        `, [req.user.id, limit]);

        // Combinar e ordenar atividades
        const allActivity = [...gameActivity, ...transactionActivity]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);

        res.json({
            success: true,
            activity: allActivity
        });
    } catch (error) {
        console.error('Erro ao obter atividade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar atividade recente'
        });
    }
});

module.exports = router;