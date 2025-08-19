const database = require('./database');
const User = require('./User');

class Lobby {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.max_players = data.max_players || 10;
        this.current_players = data.current_players || 0;
        this.entry_fee = data.entry_fee;
        this.status = data.status || 'waiting';
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.started_at = data.started_at;
        this.finished_at = data.finished_at;
        this.participants = [];
    }

    // Criar novo lobby
    static async create(name, entryFee, maxPlayers, createdBy) {
        try {
            const result = await database.run(
                `INSERT INTO lobbies (name, entry_fee, max_players, created_by) 
                 VALUES (?, ?, ?, ?)`,
                [name, entryFee, maxPlayers, createdBy]
            );

            return await this.findById(result.id);
        } catch (error) {
            console.error('Erro ao criar lobby:', error);
            throw error;
        }
    }

    // Buscar lobby por ID
    static async findById(id) {
        try {
            const lobbyData = await database.get('SELECT * FROM lobbies WHERE id = ?', [id]);
            if (!lobbyData) return null;

            const lobby = new Lobby(lobbyData);
            await lobby.loadParticipants();
            return lobby;
        } catch (error) {
            console.error('Erro ao buscar lobby:', error);
            throw error;
        }
    }

    // Listar lobbies disponíveis
    static async getAvailableLobbies() {
        try {
            const lobbies = await database.all(
                `SELECT l.*, u.username as creator_name 
                 FROM lobbies l
                 JOIN users u ON l.created_by = u.id
                 WHERE l.status = 'waiting' AND l.current_players < l.max_players
                 ORDER BY l.created_at DESC`
            );

            return lobbies.map(lobbyData => new Lobby(lobbyData));
        } catch (error) {
            console.error('Erro ao listar lobbies:', error);
            throw error;
        }
    }

    // Carregar participantes do lobby
    async loadParticipants() {
        try {
            const participants = await database.all(
                `SELECT lp.*, u.username, u.avatar, u.steam_id 
                 FROM lobby_participants lp
                 JOIN users u ON lp.user_id = u.id
                 WHERE lp.lobby_id = ?
                 ORDER BY lp.joined_at ASC`,
                [this.id]
            );

            this.participants = participants;
            this.current_players = participants.length;
        } catch (error) {
            console.error('Erro ao carregar participantes:', error);
            throw error;
        }
    }

    // Adicionar jogador ao lobby
    async addPlayer(userId) {
        try {
            // Verificar se o lobby está disponível
            if (this.status !== 'waiting') {
                throw new Error('Lobby não está disponível para novos jogadores');
            }

            if (this.current_players >= this.max_players) {
                throw new Error('Lobby está cheio');
            }

            // Verificar se o jogador já está no lobby
            const existingParticipant = await database.get(
                'SELECT * FROM lobby_participants WHERE lobby_id = ? AND user_id = ?',
                [this.id, userId]
            );

            if (existingParticipant) {
                throw new Error('Jogador já está no lobby');
            }

            // Verificar se o jogador tem saldo suficiente
            const user = await User.findById(userId);
            if (!user || !user.canJoinLobby(this.entry_fee)) {
                throw new Error('Saldo insuficiente');
            }

            // Debitar taxa de entrada
            await user.updateBalance(this.entry_fee, 'subtract');

            // Adicionar ao lobby
            await database.run(
                'INSERT INTO lobby_participants (lobby_id, user_id) VALUES (?, ?)',
                [this.id, userId]
            );

            // Atualizar contador de jogadores
            await database.run(
                'UPDATE lobbies SET current_players = current_players + 1 WHERE id = ?',
                [this.id]
            );

            await this.loadParticipants();

            // Verificar se o lobby está cheio para iniciar automaticamente
            if (this.current_players >= this.max_players) {
                await this.start();
            }

            return true;
        } catch (error) {
            console.error('Erro ao adicionar jogador:', error);
            throw error;
        }
    }

    // Remover jogador do lobby
    async removePlayer(userId) {
        try {
            // Verificar se o lobby ainda permite saídas
            if (this.status !== 'waiting') {
                throw new Error('Não é possível sair do lobby após o início');
            }

            // Verificar se o jogador está no lobby
            const participant = await database.get(
                'SELECT * FROM lobby_participants WHERE lobby_id = ? AND user_id = ?',
                [this.id, userId]
            );

            if (!participant) {
                throw new Error('Jogador não está no lobby');
            }

            // Reembolsar taxa de entrada
            const user = await User.findById(userId);
            await user.updateBalance(this.entry_fee, 'add');

            // Remover do lobby
            await database.run(
                'DELETE FROM lobby_participants WHERE lobby_id = ? AND user_id = ?',
                [this.id, userId]
            );

            // Atualizar contador de jogadores
            await database.run(
                'UPDATE lobbies SET current_players = current_players - 1 WHERE id = ?',
                [this.id]
            );

            await this.loadParticipants();
            return true;
        } catch (error) {
            console.error('Erro ao remover jogador:', error);
            throw error;
        }
    }

    // Iniciar lobby
    async start() {
        try {
            if (this.status !== 'waiting') {
                throw new Error('Lobby já foi iniciado');
            }

            if (this.current_players < 2) {
                throw new Error('Mínimo de 2 jogadores necessário');
            }

            await database.run(
                'UPDATE lobbies SET status = ?, started_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['in_progress', this.id]
            );

            this.status = 'in_progress';
            this.started_at = new Date().toISOString();

            return true;
        } catch (error) {
            console.error('Erro ao iniciar lobby:', error);
            throw error;
        }
    }

    // Finalizar lobby e distribuir prêmios
    async finish(results) {
        try {
            if (this.status !== 'in_progress') {
                throw new Error('Lobby não está em progresso');
            }

            // Calcular prêmios
            const totalPrize = this.entry_fee * this.current_players;
            const platformFee = await database.getSetting('platform_fee_percentage') || 5;
            const netPrize = totalPrize * (1 - platformFee / 100);

            // Ordenar resultados por pontuação
            const sortedResults = results.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.totalTime - b.totalTime; // Menor tempo em caso de empate
            });

            // Distribuir prêmios (winner takes all por enquanto)
            const winner = sortedResults[0];
            if (winner) {
                const winnerUser = await User.findById(winner.userId);
                await winnerUser.updateBalance(netPrize, 'add');
                await winnerUser.addWin(netPrize);

                // Atualizar posição do vencedor
                await database.run(
                    'UPDATE lobby_participants SET position = 1, score = ?, prize = ? WHERE lobby_id = ? AND user_id = ?',
                    [winner.score, netPrize, this.id, winner.userId]
                );
            }

            // Atualizar posições dos outros jogadores
            for (let i = 1; i < sortedResults.length; i++) {
                const player = sortedResults[i];
                await database.run(
                    'UPDATE lobby_participants SET position = ?, score = ? WHERE lobby_id = ? AND user_id = ?',
                    [i + 1, player.score, this.id, player.userId]
                );

                // Adicionar jogo ao histórico
                const user = await User.findById(player.userId);
                await user.addGame();
            }

            // Salvar histórico do jogo para todos os jogadores
            for (const result of sortedResults) {
                await database.run(
                    `INSERT INTO game_history 
                     (lobby_id, user_id, final_score, final_position, prize_won, questions_correct, total_questions, average_time)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        this.id,
                        result.userId,
                        result.score,
                        result.position || sortedResults.findIndex(r => r.userId === result.userId) + 1,
                        result.userId === winner?.userId ? netPrize : 0,
                        result.correctAnswers,
                        result.totalQuestions,
                        result.averageTime
                    ]
                );
            }

            // Finalizar lobby
            await database.run(
                'UPDATE lobbies SET status = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['finished', this.id]
            );

            this.status = 'finished';
            this.finished_at = new Date().toISOString();

            return {
                winner: winner ? await User.findById(winner.userId) : null,
                results: sortedResults,
                totalPrize: netPrize
            };
        } catch (error) {
            console.error('Erro ao finalizar lobby:', error);
            throw error;
        }
    }

    // Verificar se o jogador está no lobby
    hasPlayer(userId) {
        return this.participants.some(p => p.user_id === userId);
    }

    // Obter informações do lobby para JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            max_players: this.max_players,
            current_players: this.current_players,
            entry_fee: this.entry_fee,
            status: this.status,
            created_by: this.created_by,
            created_at: this.created_at,
            started_at: this.started_at,
            finished_at: this.finished_at,
            participants: this.participants
        };
    }
}

module.exports = Lobby;