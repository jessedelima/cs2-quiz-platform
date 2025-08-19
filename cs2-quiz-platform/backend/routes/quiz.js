const express = require('express');
const { requireAuth } = require('../middleware/passport');
const Lobby = require('../models/Lobby');
const Question = require('../models/Question');
const database = require('../models/database');
const router = express.Router();

// Iniciar quiz para um lobby
router.post('/start/:lobbyId', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.lobbyId);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        if (lobby.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: 'Lobby não está em progresso'
            });
        }

        if (!lobby.hasPlayer(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Você não está neste lobby'
            });
        }

        // Obter perguntas aleatórias
        const questionsPerQuiz = parseInt(await database.getSetting('questions_per_quiz')) || 10;
        const questions = await Question.getRandomQuestions(questionsPerQuiz);

        if (questions.length < questionsPerQuiz) {
            return res.status(500).json({
                success: false,
                message: 'Não há perguntas suficientes no banco de dados'
            });
        }

        // Retornar perguntas sem as respostas corretas
        const questionsForClient = questions.map(q => q.toJSON(false));

        res.json({
            success: true,
            questions: questionsForClient,
            timeLimit: parseInt(await database.getSetting('quiz_time_limit')) || 30,
            totalQuestions: questionsPerQuiz
        });
    } catch (error) {
        console.error('Erro ao iniciar quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao iniciar quiz'
        });
    }
});

// Submeter resposta para uma pergunta
router.post('/answer', requireAuth, async (req, res) => {
    try {
        const { lobbyId, questionId, selectedAnswer, timeTaken } = req.body;

        // Validações
        if (!lobbyId || !questionId || !selectedAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Dados incompletos'
            });
        }

        const lobby = await Lobby.findById(lobbyId);
        if (!lobby || lobby.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: 'Lobby inválido ou não está em progresso'
            });
        }

        if (!lobby.hasPlayer(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Você não está neste lobby'
            });
        }

        // Verificar se já respondeu esta pergunta
        const existingAnswer = await database.get(
            'SELECT * FROM user_answers WHERE lobby_id = ? AND user_id = ? AND question_id = ?',
            [lobbyId, req.user.id, questionId]
        );

        if (existingAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Você já respondeu esta pergunta'
            });
        }

        // Obter pergunta e verificar resposta
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Pergunta não encontrada'
            });
        }

        const isCorrect = question.isCorrectAnswer(selectedAnswer);

        // Salvar resposta
        await database.run(
            `INSERT INTO user_answers (lobby_id, user_id, question_id, selected_answer, is_correct, time_taken)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [lobbyId, req.user.id, questionId, selectedAnswer.toUpperCase(), isCorrect, timeTaken || 0]
        );

        res.json({
            success: true,
            correct: isCorrect,
            correctAnswer: question.correct_answer,
            message: isCorrect ? 'Resposta correta!' : 'Resposta incorreta!'
        });
    } catch (error) {
        console.error('Erro ao submeter resposta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar resposta'
        });
    }
});

// Finalizar quiz e calcular resultados
router.post('/finish/:lobbyId', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.lobbyId);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        if (lobby.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                message: 'Lobby não está em progresso'
            });
        }

        if (!lobby.hasPlayer(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Você não está neste lobby'
            });
        }

        // Calcular resultados de todos os jogadores
        const results = [];
        
        for (const participant of lobby.participants) {
            const userAnswers = await database.all(
                `SELECT * FROM user_answers 
                 WHERE lobby_id = ? AND user_id = ?
                 ORDER BY answered_at ASC`,
                [lobby.id, participant.user_id]
            );

            const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
            const totalQuestions = userAnswers.length;
            const totalTime = userAnswers.reduce((sum, answer) => sum + (answer.time_taken || 0), 0);
            const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

            // Sistema de pontuação: pontos por resposta correta + bônus por velocidade
            let score = correctAnswers * 100; // 100 pontos por resposta correta
            
            // Bônus por velocidade (máximo 50 pontos por pergunta)
            for (const answer of userAnswers) {
                if (answer.is_correct && answer.time_taken) {
                    const timeLimit = parseInt(await database.getSetting('quiz_time_limit')) || 30;
                    const speedBonus = Math.max(0, Math.round((timeLimit - answer.time_taken) * 1.67)); // 1.67 pontos por segundo restante
                    score += Math.min(50, speedBonus);
                }
            }

            results.push({
                userId: participant.user_id,
                username: participant.username,
                score: score,
                correctAnswers: correctAnswers,
                totalQuestions: totalQuestions,
                totalTime: totalTime,
                averageTime: averageTime
            });
        }

        // Finalizar lobby com os resultados
        const gameResult = await lobby.finish(results);

        // Emitir resultados via Socket.IO
        req.app.get('io').to(`lobby_${lobby.id}`).emit('gameFinished', {
            results: gameResult.results,
            winner: gameResult.winner,
            totalPrize: gameResult.totalPrize
        });

        res.json({
            success: true,
            message: 'Quiz finalizado com sucesso',
            results: gameResult.results,
            winner: gameResult.winner,
            totalPrize: gameResult.totalPrize
        });
    } catch (error) {
        console.error('Erro ao finalizar quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao finalizar quiz'
        });
    }
});

// Obter progresso do quiz para um jogador
router.get('/progress/:lobbyId', requireAuth, async (req, res) => {
    try {
        const lobby = await Lobby.findById(req.params.lobbyId);
        
        if (!lobby) {
            return res.status(404).json({
                success: false,
                message: 'Lobby não encontrado'
            });
        }

        if (!lobby.hasPlayer(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Você não está neste lobby'
            });
        }

        // Obter respostas do usuário
        const userAnswers = await database.all(
            `SELECT ua.*, q.question 
             FROM user_answers ua
             JOIN questions q ON ua.question_id = q.id
             WHERE ua.lobby_id = ? AND ua.user_id = ?
             ORDER BY ua.answered_at ASC`,
            [lobby.id, req.user.id]
        );

        const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
        const totalQuestions = parseInt(await database.getSetting('questions_per_quiz')) || 10;

        res.json({
            success: true,
            progress: {
                answeredQuestions: userAnswers.length,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                score: correctAnswers * 100, // Pontuação básica
                answers: userAnswers
            }
        });
    } catch (error) {
        console.error('Erro ao obter progresso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar progresso'
        });
    }
});

// Obter estatísticas gerais do quiz
router.get('/stats', async (req, res) => {
    try {
        const stats = await database.get(`
            SELECT 
                COUNT(DISTINCT lobby_id) as total_games,
                COUNT(DISTINCT user_id) as total_players,
                AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100 as avg_accuracy,
                COUNT(*) as total_answers
            FROM user_answers
        `);

        const topPlayers = await database.all(`
            SELECT 
                u.username,
                u.avatar,
                COUNT(DISTINCT gh.lobby_id) as games_played,
                SUM(gh.prize_won) as total_winnings,
                AVG(gh.final_score) as avg_score
            FROM users u
            JOIN game_history gh ON u.id = gh.user_id
            GROUP BY u.id
            ORDER BY total_winnings DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            stats: {
                totalGames: stats.total_games || 0,
                totalPlayers: stats.total_players || 0,
                avgAccuracy: Math.round(stats.avg_accuracy || 0),
                totalAnswers: stats.total_answers || 0,
                topPlayers: topPlayers
            }
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar estatísticas'
        });
    }
});

module.exports = router;