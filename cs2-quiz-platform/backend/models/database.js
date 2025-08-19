const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/cs2quiz.db');
    }

    async init() {
        return new Promise((resolve, reject) => {
            // Criar diretório se não existir
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Erro ao conectar com o banco de dados:', err);
                    reject(err);
                } else {
                    console.log('✅ Conectado ao banco de dados SQLite');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // Tabela de usuários
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                steam_id TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                avatar TEXT,
                profile_url TEXT,
                balance REAL DEFAULT 0.0,
                total_games INTEGER DEFAULT 0,
                total_wins INTEGER DEFAULT 0,
                total_earnings REAL DEFAULT 0.0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Tabela de lobbies
            `CREATE TABLE IF NOT EXISTS lobbies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                max_players INTEGER DEFAULT 10,
                current_players INTEGER DEFAULT 0,
                entry_fee REAL NOT NULL,
                status TEXT DEFAULT 'waiting', -- waiting, in_progress, finished
                created_by INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                started_at DATETIME,
                finished_at DATETIME,
                FOREIGN KEY (created_by) REFERENCES users (id)
            )`,

            // Tabela de participantes do lobby
            `CREATE TABLE IF NOT EXISTS lobby_participants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lobby_id INTEGER,
                user_id INTEGER,
                position INTEGER,
                score INTEGER DEFAULT 0,
                prize REAL DEFAULT 0.0,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lobby_id) REFERENCES lobbies (id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(lobby_id, user_id)
            )`,

            // Tabela de perguntas
            `CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer TEXT NOT NULL, -- A, B, C, D
                difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
                category TEXT DEFAULT 'general', -- general, weapons, maps, tactics, history
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Tabela de respostas dos usuários
            `CREATE TABLE IF NOT EXISTS user_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lobby_id INTEGER,
                user_id INTEGER,
                question_id INTEGER,
                selected_answer TEXT, -- A, B, C, D
                is_correct BOOLEAN,
                time_taken INTEGER, -- em segundos
                answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lobby_id) REFERENCES lobbies (id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (question_id) REFERENCES questions (id)
            )`,

            // Tabela de transações de skins
            `CREATE TABLE IF NOT EXISTS skin_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                type TEXT NOT NULL, -- deposit, withdrawal
                skin_name TEXT,
                skin_value REAL,
                steam_trade_id TEXT,
                status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Tabela de histórico de jogos
            `CREATE TABLE IF NOT EXISTS game_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lobby_id INTEGER,
                user_id INTEGER,
                final_score INTEGER,
                final_position INTEGER,
                prize_won REAL DEFAULT 0.0,
                questions_correct INTEGER DEFAULT 0,
                total_questions INTEGER DEFAULT 10,
                average_time REAL,
                played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lobby_id) REFERENCES lobbies (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Tabela de configurações do sistema
            `CREATE TABLE IF NOT EXISTS system_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT NOT NULL,
                description TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Tabela de chat do lobby
            `CREATE TABLE IF NOT EXISTS lobby_chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lobby_id INTEGER,
                user_id INTEGER,
                message TEXT NOT NULL,
                sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lobby_id) REFERENCES lobbies (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }

        // Inserir configurações padrão
        await this.insertDefaultSettings();
        
        console.log('✅ Todas as tabelas foram criadas com sucesso');
    }

    async insertDefaultSettings() {
        const defaultSettings = [
            ['platform_fee_percentage', '5', 'Porcentagem de taxa da plataforma'],
            ['max_players_per_lobby', '10', 'Máximo de jogadores por lobby'],
            ['quiz_time_limit', '30', 'Tempo limite por pergunta em segundos'],
            ['questions_per_quiz', '10', 'Número de perguntas por quiz'],
            ['min_skin_value', '1.00', 'Valor mínimo de skin para depósito']
        ];

        for (const [key, value, description] of defaultSettings) {
            await this.run(
                `INSERT OR IGNORE INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?)`,
                [key, value, description]
            );
        }
    }

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('Erro ao executar SQL:', err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('Erro ao buscar dados:', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Erro ao buscar dados:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Conexão com banco de dados fechada');
                    resolve();
                }
            });
        });
    }

    // Métodos utilitários
    async getSetting(key) {
        const result = await this.get(
            'SELECT setting_value FROM system_settings WHERE setting_key = ?',
            [key]
        );
        return result ? result.setting_value : null;
    }

    async setSetting(key, value) {
        await this.run(
            `INSERT OR REPLACE INTO system_settings (setting_key, setting_value, updated_at) 
             VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [key, value]
        );
    }
}

// Singleton instance
const database = new Database();

module.exports = database;