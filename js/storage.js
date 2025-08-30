// ===== SISTEMA DE ARMAZENAMENTO LOCAL =====

class QuizStorage {
    constructor() {
        this.storageKey = 'cs2_quiz_data';
        this.initializeStorage();
    }

    // Inicializar estrutura de dados
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                player: {
                    name: '',
                    totalGames: 0,
                    bestScore: 0,
                    totalPoints: 0,
                    totalCorrectAnswers: 0,
                    totalQuestions: 0,
                    averageTime: 0,
                    favoriteCategory: '',
                    achievements: []
                },
                games: [],
                rankings: [],
                statistics: {
                    byDifficulty: {
                        facil: { games: 0, bestScore: 0, totalPoints: 0, accuracy: 0 },
                        medio: { games: 0, bestScore: 0, totalPoints: 0, accuracy: 0 },
                        dificil: { games: 0, bestScore: 0, totalPoints: 0, accuracy: 0 },
                        competitivo: { games: 0, bestScore: 0, totalPoints: 0, accuracy: 0 }
                    },
                    byCategory: {},
                    streaks: {
                        current: 0,
                        best: 0
                    }
                },
                settings: {
                    soundEffects: true,
                    animations: true,
                    volume: 50
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    // Obter todos os dados
    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.initializeStorage();
            return JSON.parse(localStorage.getItem(this.storageKey));
        }
    }

    // Salvar dados
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    // Salvar resultado do jogo
    saveGameResult(gameData) {
        const data = this.getData();
        const timestamp = new Date().toISOString();
        
        // Dados do jogo
        const gameResult = {
            id: Date.now(),
            timestamp: timestamp,
            playerName: gameData.playerName || 'Anônimo',
            difficulty: gameData.difficulty,
            score: gameData.score,
            totalQuestions: gameData.totalQuestions,
            correctAnswers: gameData.correctAnswers,
            totalPoints: gameData.totalPoints,
            averageTime: gameData.averageTime,
            accuracy: Math.round((gameData.correctAnswers / gameData.totalQuestions) * 100),
            bestStreak: gameData.bestStreak,
            categoryStats: gameData.categoryStats || {}
        };

        // Adicionar ao histórico de jogos
        data.games.unshift(gameResult);
        
        // Manter apenas os últimos 50 jogos
        if (data.games.length > 50) {
            data.games = data.games.slice(0, 50);
        }

        // Atualizar estatísticas do jogador
        this.updatePlayerStats(data, gameResult);
        
        // Atualizar ranking
        this.updateRanking(data, gameResult);
        
        // Verificar conquistas
        this.checkAchievements(data, gameResult);

        this.saveData(data);
        return gameResult;
    }

    // Atualizar estatísticas do jogador
    updatePlayerStats(data, gameResult) {
        const player = data.player;
        
        // Estatísticas gerais
        player.totalGames++;
        player.totalPoints += gameResult.totalPoints;
        player.totalCorrectAnswers += gameResult.correctAnswers;
        player.totalQuestions += gameResult.totalQuestions;
        
        // Melhor pontuação
        if (gameResult.score > player.bestScore) {
            player.bestScore = gameResult.score;
        }
        
        // Tempo médio
        const totalTime = (player.averageTime * (player.totalGames - 1)) + gameResult.averageTime;
        player.averageTime = Math.round(totalTime / player.totalGames);
        
        // Estatísticas por dificuldade
        const diffStats = data.statistics.byDifficulty[gameResult.difficulty];
        if (diffStats) {
            diffStats.games++;
            diffStats.totalPoints += gameResult.totalPoints;
            if (gameResult.score > diffStats.bestScore) {
                diffStats.bestScore = gameResult.score;
            }
            diffStats.accuracy = Math.round(
                ((diffStats.accuracy * (diffStats.games - 1)) + gameResult.accuracy) / diffStats.games
            );
        }
        
        // Estatísticas por categoria
        for (const [category, stats] of Object.entries(gameResult.categoryStats)) {
            if (!data.statistics.byCategory[category]) {
                data.statistics.byCategory[category] = {
                    questions: 0,
                    correct: 0,
                    accuracy: 0
                };
            }
            
            const catStats = data.statistics.byCategory[category];
            catStats.questions += stats.total;
            catStats.correct += stats.correct;
            catStats.accuracy = Math.round((catStats.correct / catStats.questions) * 100);
        }
        
        // Categoria favorita (mais jogada)
        let maxQuestions = 0;
        let favoriteCategory = '';
        for (const [category, stats] of Object.entries(data.statistics.byCategory)) {
            if (stats.questions > maxQuestions) {
                maxQuestions = stats.questions;
                favoriteCategory = category;
            }
        }
        player.favoriteCategory = favoriteCategory;
        
        // Atualizar streaks
        if (gameResult.bestStreak > data.statistics.streaks.best) {
            data.statistics.streaks.best = gameResult.bestStreak;
        }
    }

    // Atualizar ranking
    updateRanking(data, gameResult) {
        // Encontrar entrada existente do jogador
        let playerEntry = data.rankings.find(entry => entry.name === gameResult.playerName);
        
        if (playerEntry) {
            // Atualizar entrada existente
            playerEntry.games++;
            playerEntry.totalPoints += gameResult.totalPoints;
            playerEntry.totalCorrect += gameResult.correctAnswers;
            playerEntry.totalQuestions += gameResult.totalQuestions;
            
            if (gameResult.score > playerEntry.bestScore) {
                playerEntry.bestScore = gameResult.score;
                playerEntry.bestScoreDate = gameResult.timestamp;
            }
            
            playerEntry.accuracy = Math.round((playerEntry.totalCorrect / playerEntry.totalQuestions) * 100);
            playerEntry.averageScore = Math.round(playerEntry.totalPoints / playerEntry.games);
            playerEntry.lastPlayed = gameResult.timestamp;
        } else {
            // Criar nova entrada
            playerEntry = {
                name: gameResult.playerName,
                games: 1,
                bestScore: gameResult.score,
                bestScoreDate: gameResult.timestamp,
                totalPoints: gameResult.totalPoints,
                totalCorrect: gameResult.correctAnswers,
                totalQuestions: gameResult.totalQuestions,
                accuracy: gameResult.accuracy,
                averageScore: gameResult.totalPoints,
                lastPlayed: gameResult.timestamp
            };
            data.rankings.push(playerEntry);
        }
        
        // Ordenar ranking por melhor pontuação
        data.rankings.sort((a, b) => b.bestScore - a.bestScore);
        
        // Manter apenas top 100
        if (data.rankings.length > 100) {
            data.rankings = data.rankings.slice(0, 100);
        }
    }

    // Verificar conquistas
    checkAchievements(data, gameResult) {
        const achievements = [];
        
        // Primeira partida
        if (data.player.totalGames === 1) {
            achievements.push({
                id: 'first_game',
                name: 'Primeira Partida',
                description: 'Completou seu primeiro quiz!',
                icon: '🎯',
                timestamp: gameResult.timestamp
            });
        }
        
        // Pontuação perfeita
        if (gameResult.accuracy === 100) {
            achievements.push({
                id: 'perfect_score',
                name: 'Pontuação Perfeita',
                description: 'Acertou todas as perguntas!',
                icon: '💯',
                timestamp: gameResult.timestamp
            });
        }
        
        // Sequência de 5
        if (gameResult.bestStreak >= 5) {
            achievements.push({
                id: 'streak_5',
                name: 'Em Chamas',
                description: 'Sequência de 5 acertos!',
                icon: '🔥',
                timestamp: gameResult.timestamp
            });
        }
        
        // Sequência de 10
        if (gameResult.bestStreak >= 10) {
            achievements.push({
                id: 'streak_10',
                name: 'Imparável',
                description: 'Sequência de 10 acertos!',
                icon: '⚡',
                timestamp: gameResult.timestamp
            });
        }
        
        // 10 jogos
        if (data.player.totalGames === 10) {
            achievements.push({
                id: 'games_10',
                name: 'Veterano',
                description: 'Completou 10 partidas!',
                icon: '🏆',
                timestamp: gameResult.timestamp
            });
        }
        
        // 50 jogos
        if (data.player.totalGames === 50) {
            achievements.push({
                id: 'games_50',
                name: 'Especialista',
                description: 'Completou 50 partidas!',
                icon: '👑',
                timestamp: gameResult.timestamp
            });
        }
        
        // Modo difícil com 80%+ de precisão
        if (gameResult.difficulty === 'dificil' && gameResult.accuracy >= 80) {
            achievements.push({
                id: 'hard_master',
                name: 'Mestre do Difícil',
                description: '80%+ de precisão no modo difícil!',
                icon: '🎖️',
                timestamp: gameResult.timestamp
            });
        }
        
        // Adicionar novas conquistas
        achievements.forEach(achievement => {
            if (!data.player.achievements.find(a => a.id === achievement.id)) {
                data.player.achievements.push(achievement);
            }
        });
        
        return achievements;
    }

    // Obter ranking
    getRanking(limit = 10) {
        const data = this.getData();
        return data.rankings.slice(0, limit);
    }

    // Obter estatísticas do jogador
    getPlayerStats() {
        const data = this.getData();
        return {
            ...data.player,
            overallAccuracy: data.player.totalQuestions > 0 
                ? Math.round((data.player.totalCorrectAnswers / data.player.totalQuestions) * 100)
                : 0
        };
    }

    // Obter histórico de jogos
    getGameHistory(limit = 10) {
        const data = this.getData();
        return data.games.slice(0, limit);
    }

    // Obter configurações
    getSettings() {
        const data = this.getData();
        return data.settings;
    }

    // Salvar configurações
    saveSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.saveData(data);
    }

    // Salvar nome do jogador
    savePlayerName(name) {
        const data = this.getData();
        data.player.name = name;
        this.saveData(data);
    }

    // Resetar todas as estatísticas
    resetAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    // Exportar dados
    exportData() {
        const data = this.getData();
        const exportData = {
            ...data,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cs2_quiz_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Importar dados
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validar estrutura básica
                    if (importedData.player && importedData.games && importedData.rankings) {
                        this.saveData(importedData);
                        resolve(true);
                    } else {
                        reject(new Error('Formato de arquivo inválido'));
                    }
                } catch (error) {
                    reject(new Error('Erro ao processar arquivo: ' + error.message));
                }
            };
            reader.readAsText(file);
        });
    }
}
// Instância global do storage
const quizStorage = new QuizStorage();

// Exportar para uso global
window.quizStorage = quizStorage;
