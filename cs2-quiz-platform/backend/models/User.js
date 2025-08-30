const database = require('./database');

class User {
    constructor(data) {
        this.id = data.id;
        this.steam_id = data.steam_id;
        this.google_id = data.google_id;
        this.username = data.username;
        this.avatar = data.avatar;
        this.profile_url = data.profile_url;
        this.email = data.email;
        this.provider = data.provider || 'steam';
        this.balance = data.balance || 0.0;
        this.total_games = data.total_games || 0;
        this.total_wins = data.total_wins || 0;
        this.total_earnings = data.total_earnings || 0.0;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Criar ou atualizar usuário
    static async createOrUpdate(profileData) {
        try {
            let existingUser = null;
            const provider = profileData.provider || 'steam';
            
            if (provider === 'steam') {
                existingUser = await this.findBySteamId(profileData.id);
            } else if (provider === 'google') {
                existingUser = await this.findByGoogleId(profileData.id);
            }
            
            // Obter dados do perfil com base no provedor
            const username = profileData.displayName;
            const avatar = provider === 'steam' ? profileData.photos[0].value : 
                          (profileData.photos && profileData.photos.length > 0 ? profileData.photos[0].value : null);
            const profileUrl = provider === 'steam' ? profileData.profileUrl : 
                             (profileData._json && profileData._json.url ? profileData._json.url : null);
            const email = provider === 'google' && profileData.emails && profileData.emails.length > 0 ? 
                         profileData.emails[0].value : null;
            
            if (existingUser) {
                // Atualizar dados do usuário existente
                if (provider === 'steam') {
                    await database.run(
                        `UPDATE users SET 
                         username = ?, avatar = ?, profile_url = ?, updated_at = CURRENT_TIMESTAMP 
                         WHERE steam_id = ?`,
                        [username, avatar, profileUrl, profileData.id]
                    );
                    return await this.findBySteamId(profileData.id);
                } else if (provider === 'google') {
                    await database.run(
                        `UPDATE users SET 
                         username = ?, avatar = ?, profile_url = ?, email = ?, updated_at = CURRENT_TIMESTAMP 
                         WHERE google_id = ?`,
                        [username, avatar, profileUrl, email, profileData.id]
                    );
                    return await this.findByGoogleId(profileData.id);
                }
            } else {
                // Criar novo usuário
                let result;
                if (provider === 'steam') {
                    result = await database.run(
                        `INSERT INTO users (steam_id, username, avatar, profile_url, provider) 
                         VALUES (?, ?, ?, ?, ?)`,
                        [profileData.id, username, avatar, profileUrl, provider]
                    );
                } else if (provider === 'google') {
                    result = await database.run(
                        `INSERT INTO users (google_id, username, avatar, profile_url, email, provider) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [profileData.id, username, avatar, profileUrl, email, provider]
                    );
                }
                return await this.findById(result.id);
            }
        } catch (error) {
            console.error('Erro ao criar/atualizar usuário:', error);
            throw error;
        }
    }

    // Buscar usuário por ID
    static async findById(id) {
        try {
            const userData = await database.get('SELECT * FROM users WHERE id = ?', [id]);
            return userData ? new User(userData) : null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    // Buscar usuário por Steam ID
    static async findBySteamId(steamId) {
        try {
            const userData = await database.get('SELECT * FROM users WHERE steam_id = ?', [steamId]);
            return userData ? new User(userData) : null;
        } catch (error) {
            console.error('Erro ao buscar usuário por Steam ID:', error);
            throw error;
        }
    }

    // Atualizar saldo do usuário
    async updateBalance(amount, operation = 'add') {
        try {
            let newBalance;
            if (operation === 'add') {
                newBalance = this.balance + amount;
            } else if (operation === 'subtract') {
                newBalance = Math.max(0, this.balance - amount);
            } else {
                newBalance = amount;
            }

            await database.run(
                'UPDATE users SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [newBalance, this.id]
            );
            
            this.balance = newBalance;
            return this.balance;
        } catch (error) {
            console.error('Erro ao atualizar saldo:', error);
            throw error;
        }
    }

    // Adicionar vitória
    async addWin(prize = 0) {
        try {
            await database.run(
                `UPDATE users SET 
                 total_wins = total_wins + 1, 
                 total_earnings = total_earnings + ?,
                 updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [prize, this.id]
            );
            
            this.total_wins += 1;
            this.total_earnings += prize;
        } catch (error) {
            console.error('Erro ao adicionar vitória:', error);
            throw error;
        }
    }

    // Adicionar jogo jogado
    async addGame() {
        try {
            await database.run(
                'UPDATE users SET total_games = total_games + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [this.id]
            );
            
            this.total_games += 1;
        } catch (error) {
            console.error('Erro ao adicionar jogo:', error);
            throw error;
        }
    }

    // Obter estatísticas do usuário
    async getStats() {
        try {
            const stats = await database.get(
                `SELECT 
                    COUNT(*) as games_played,
                    AVG(final_score) as avg_score,
                    MAX(final_score) as best_score,
                    SUM(prize_won) as total_winnings,
                    AVG(questions_correct * 100.0 / total_questions) as avg_accuracy
                 FROM game_history 
                 WHERE user_id = ?`,
                [this.id]
            );

            return {
                games_played: stats.games_played || 0,
                avg_score: Math.round(stats.avg_score || 0),
                best_score: stats.best_score || 0,
                total_winnings: stats.total_winnings || 0,
                avg_accuracy: Math.round(stats.avg_accuracy || 0),
                win_rate: this.total_games > 0 ? Math.round((this.total_wins / this.total_games) * 100) : 0
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    // Obter histórico de jogos
    async getGameHistory(limit = 10) {
        try {
            const history = await database.all(
                `SELECT gh.*, l.name as lobby_name 
                 FROM game_history gh
                 JOIN lobbies l ON gh.lobby_id = l.id
                 WHERE gh.user_id = ?
                 ORDER BY gh.played_at DESC
                 LIMIT ?`,
                [this.id, limit]
            );

            return history;
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            throw error;
        }
    }

    // Verificar se pode participar do lobby
    async canJoinLobby(entryFee) {
        return this.balance >= entryFee;
    }

    // Obter ranking do usuário
    static async getLeaderboard(limit = 10) {
        try {
            const leaderboard = await database.all(
                `SELECT 
                    u.id, u.username, u.avatar, u.total_wins, u.total_games, u.total_earnings,
                    CASE WHEN u.total_games > 0 THEN (u.total_wins * 100.0 / u.total_games) ELSE 0 END as win_rate
                 FROM users u
                 WHERE u.total_games > 0
                 ORDER BY u.total_earnings DESC, u.total_wins DESC
                 LIMIT ?`,
                [limit]
            );

            return leaderboard.map((user, index) => ({
                ...user,
                position: index + 1,
                win_rate: Math.round(user.win_rate)
            }));
        } catch (error) {
            console.error('Erro ao obter leaderboard:', error);
            throw error;
        }
    }

    // Converter para objeto JSON (sem dados sensíveis)
    toJSON() {
        return {
            id: this.id,
            steam_id: this.steam_id,
            username: this.username,
            avatar: this.avatar,
            balance: this.balance,
            total_games: this.total_games,
            total_wins: this.total_wins,
            total_earnings: this.total_earnings,
            created_at: this.created_at
        };
    }
}

module.exports = User;