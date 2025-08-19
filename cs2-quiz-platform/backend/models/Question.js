const database = require('./database');

class Question {
    constructor(data) {
        this.id = data.id;
        this.question = data.question;
        this.option_a = data.option_a;
        this.option_b = data.option_b;
        this.option_c = data.option_c;
        this.option_d = data.option_d;
        this.correct_answer = data.correct_answer;
        this.difficulty = data.difficulty;
        this.category = data.category;
        this.created_at = data.created_at;
    }

    // Criar nova pergunta
    static async create(questionData) {
        try {
            const { question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category } = questionData;
            
            const result = await database.run(
                `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category]
            );

            return await this.findById(result.id);
        } catch (error) {
            console.error('Erro ao criar pergunta:', error);
            throw error;
        }
    }

    // Buscar pergunta por ID
    static async findById(id) {
        try {
            const questionData = await database.get('SELECT * FROM questions WHERE id = ?', [id]);
            return questionData ? new Question(questionData) : null;
        } catch (error) {
            console.error('Erro ao buscar pergunta:', error);
            throw error;
        }
    }

    // Obter perguntas aleatórias para o quiz
    static async getRandomQuestions(count = 10, difficulty = null, category = null) {
        try {
            let sql = 'SELECT * FROM questions';
            let params = [];
            let conditions = [];

            if (difficulty) {
                conditions.push('difficulty = ?');
                params.push(difficulty);
            }

            if (category) {
                conditions.push('category = ?');
                params.push(category);
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            sql += ' ORDER BY RANDOM() LIMIT ?';
            params.push(count);

            const questions = await database.all(sql, params);
            return questions.map(q => new Question(q));
        } catch (error) {
            console.error('Erro ao obter perguntas aleatórias:', error);
            throw error;
        }
    }

    // Listar todas as perguntas (para admin)
    static async getAll(page = 1, limit = 50) {
        try {
            const offset = (page - 1) * limit;
            const questions = await database.all(
                'SELECT * FROM questions ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );

            const total = await database.get('SELECT COUNT(*) as count FROM questions');

            return {
                questions: questions.map(q => new Question(q)),
                total: total.count,
                page: page,
                totalPages: Math.ceil(total.count / limit)
            };
        } catch (error) {
            console.error('Erro ao listar perguntas:', error);
            throw error;
        }
    }

    // Atualizar pergunta
    async update(updateData) {
        try {
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(updateData)) {
                if (value !== undefined && key !== 'id') {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (fields.length === 0) {
                throw new Error('Nenhum campo para atualizar');
            }

            values.push(this.id);

            await database.run(
                `UPDATE questions SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            // Recarregar dados
            const updated = await Question.findById(this.id);
            Object.assign(this, updated);

            return this;
        } catch (error) {
            console.error('Erro ao atualizar pergunta:', error);
            throw error;
        }
    }

    // Deletar pergunta
    async delete() {
        try {
            await database.run('DELETE FROM questions WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            console.error('Erro ao deletar pergunta:', error);
            throw error;
        }
    }

    // Verificar se a resposta está correta
    isCorrectAnswer(answer) {
        return answer.toUpperCase() === this.correct_answer.toUpperCase();
    }

    // Converter para JSON (sem revelar a resposta correta)
    toJSON(includeAnswer = false) {
        const json = {
            id: this.id,
            question: this.question,
            options: {
                A: this.option_a,
                B: this.option_b,
                C: this.option_c,
                D: this.option_d
            },
            difficulty: this.difficulty,
            category: this.category
        };

        if (includeAnswer) {
            json.correct_answer = this.correct_answer;
        }

        return json;
    }

    // Inserir perguntas padrão sobre CS2
    static async insertDefaultQuestions() {
        const defaultQuestions = [
            {
                question: "Qual é o nome do mapa mais icônico do Counter-Strike?",
                option_a: "Dust2",
                option_b: "Mirage",
                option_c: "Inferno",
                option_d: "Cache",
                correct_answer: "A",
                difficulty: "easy",
                category: "maps"
            },
            {
                question: "Quantos rounds são necessários para vencer uma partida competitiva no CS2?",
                option_a: "15",
                option_b: "16",
                option_c: "30",
                option_d: "13",
                correct_answer: "B",
                difficulty: "easy",
                category: "general"
            },
            {
                question: "Qual arma é conhecida como 'AK'?",
                option_a: "AK-47",
                option_b: "AUG",
                option_c: "AWP",
                option_d: "M4A4",
                correct_answer: "A",
                difficulty: "easy",
                category: "weapons"
            },
            {
                question: "Qual é o dano máximo que uma AWP pode causar com um tiro no corpo?",
                option_a: "115",
                option_b: "120",
                option_c: "125",
                option_d: "100",
                correct_answer: "A",
                difficulty: "medium",
                category: "weapons"
            },
            {
                question: "Em que ano foi lançado o Counter-Strike original?",
                option_a: "1999",
                option_b: "2000",
                option_c: "2001",
                option_d: "1998",
                correct_answer: "A",
                difficulty: "medium",
                category: "history"
            },
            {
                question: "Qual é o preço da AK-47 no jogo?",
                option_a: "$2700",
                option_b: "$2500",
                option_c: "$3100",
                option_d: "$2400",
                correct_answer: "A",
                difficulty: "medium",
                category: "weapons"
            },
            {
                question: "Quantos pontos de vida um jogador tem no início de cada round?",
                option_a: "100",
                option_b: "120",
                option_c: "80",
                option_d: "90",
                correct_answer: "A",
                difficulty: "easy",
                category: "general"
            },
            {
                question: "Qual é o tempo padrão de uma bomba no CS2?",
                option_a: "35 segundos",
                option_b: "40 segundos",
                option_c: "45 segundos",
                option_d: "30 segundos",
                correct_answer: "B",
                difficulty: "medium",
                category: "general"
            },
            {
                question: "Qual mapa foi adicionado mais recentemente ao pool competitivo?",
                option_a: "Ancient",
                option_b: "Vertigo",
                option_c: "Anubis",
                option_d: "Overpass",
                correct_answer: "C",
                difficulty: "hard",
                category: "maps"
            },
            {
                question: "Qual é o dano de uma granada HE no epicentro da explosão?",
                option_a: "98",
                option_b: "100",
                option_c: "95",
                option_d: "90",
                correct_answer: "A",
                difficulty: "hard",
                category: "weapons"
            },
            {
                question: "Qual tecla é usada por padrão para dropar armas?",
                option_a: "G",
                option_b: "H",
                option_c: "F",
                option_d: "T",
                correct_answer: "A",
                difficulty: "easy",
                category: "general"
            },
            {
                question: "Qual é o nome do site A no mapa Mirage?",
                option_a: "Ramp",
                option_b: "Palace",
                option_c: "Default",
                option_d: "Não tem nome específico",
                correct_answer: "B",
                difficulty: "medium",
                category: "maps"
            },
            {
                question: "Quantas granadas de fumaça um jogador pode carregar?",
                option_a: "1",
                option_b: "2",
                option_c: "3",
                option_d: "4",
                correct_answer: "A",
                difficulty: "easy",
                category: "general"
            },
            {
                question: "Qual é o preço de uma AWP?",
                option_a: "$4750",
                option_b: "$5000",
                option_c: "$4500",
                option_d: "$4800",
                correct_answer: "A",
                difficulty: "medium",
                category: "weapons"
            },
            {
                question: "Em qual empresa foi desenvolvido o CS2?",
                option_a: "Valve Corporation",
                option_b: "Riot Games",
                option_c: "Blizzard",
                option_d: "Epic Games",
                correct_answer: "A",
                difficulty: "easy",
                category: "history"
            },
            {
                question: "Qual é o tempo de freeze time no início de cada round?",
                option_a: "15 segundos",
                option_b: "20 segundos",
                option_c: "10 segundos",
                option_d: "5 segundos",
                correct_answer: "A",
                difficulty: "medium",
                category: "general"
            },
            {
                question: "Qual mapa tem o callout 'Goose'?",
                option_a: "Dust2",
                option_b: "Cache",
                option_c: "Mirage",
                option_d: "Inferno",
                correct_answer: "A",
                difficulty: "hard",
                category: "maps"
            },
            {
                question: "Qual é o dano máximo de uma Deagle no headshot?",
                option_a: "240",
                option_b: "250",
                option_c: "260",
                option_d: "230",
                correct_answer: "C",
                difficulty: "hard",
                category: "weapons"
            },
            {
                question: "Quantos rounds de overtime são jogados antes de trocar de lado?",
                option_a: "3",
                option_b: "6",
                option_c: "5",
                option_d: "4",
                correct_answer: "A",
                difficulty: "medium",
                category: "general"
            },
            {
                question: "Qual é o nome da engine gráfica do CS2?",
                option_a: "Source 2",
                option_b: "Unreal Engine",
                option_c: "Unity",
                option_d: "Source",
                correct_answer: "A",
                difficulty: "medium",
                category: "history"
            }
        ];

        try {
            for (const question of defaultQuestions) {
                await database.run(
                    `INSERT OR IGNORE INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        question.question,
                        question.option_a,
                        question.option_b,
                        question.option_c,
                        question.option_d,
                        question.correct_answer,
                        question.difficulty,
                        question.category
                    ]
                );
            }
            console.log('✅ Perguntas padrão inseridas com sucesso');
        } catch (error) {
            console.error('Erro ao inserir perguntas padrão:', error);
            throw error;
        }
    }
}

module.exports = Question;