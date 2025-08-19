// ===== BANCO DE PERGUNTAS CS2 =====

const questionsDatabase = {
    facil: [
        {
            id: 1,
            category: "Armas",
            question: "Qual é a arma mais icônica do Counter-Strike?",
            options: ["AK-47", "M4A4", "AWP", "Glock-18"],
            correct: 0,
            explanation: "A AK-47 é considerada a arma mais icônica do CS, sendo a principal arma dos Terroristas.",
            points: 10
        },
        {
            id: 2,
            category: "Mapas",
            question: "Qual é o mapa mais jogado no CS2?",
            options: ["Mirage", "Dust2", "Inferno", "Cache"],
            correct: 1,
            explanation: "Dust2 é historicamente o mapa mais popular e jogado em toda a série Counter-Strike.",
            points: 10
        },
        {
            id: 3,
            category: "Básico",
            question: "Quantos jogadores há em cada time no modo competitivo?",
            options: ["4", "5", "6", "10"],
            correct: 1,
            explanation: "Cada time tem 5 jogadores no modo competitivo padrão.",
            points: 10
        },
        {
            id: 4,
            category: "Economia",
            question: "Qual é o dinheiro inicial no primeiro round?",
            options: ["$500", "$800", "$1000", "$1400"],
            correct: 1,
            explanation: "Cada jogador começa com $800 no primeiro round (pistol round).",
            points: 10
        },
        {
            id: 5,
            category: "Armas",
            question: "Qual arma pode matar com um tiro na cabeça mesmo com capacete?",
            options: ["AK-47", "M4A4", "Famas", "Galil"],
            correct: 0,
            explanation: "A AK-47 é capaz de matar com um headshot mesmo contra inimigos com capacete.",
            points: 10
        },
        {
            id: 6,
            category: "Mapas",
            question: "Em qual mapa encontramos o local chamado 'Pit'?",
            options: ["Mirage", "Dust2", "Inferno", "Overpass"],
            correct: 1,
            explanation: "O 'Pit' é uma posição famosa no mapa Dust2, localizada no bombsite A.",
            points: 10
        },
        {
            id: 7,
            category: "Básico",
            question: "Quantos rounds são necessários para vencer uma partida competitiva?",
            options: ["15", "16", "30", "32"],
            correct: 1,
            explanation: "São necessários 16 rounds para vencer uma partida competitiva (MR15).",
            points: 10
        },
        {
            id: 8,
            category: "Granadas",
            question: "Qual granada é usada para cegar temporariamente os inimigos?",
            options: ["HE Grenade", "Smoke Grenade", "Flashbang", "Molotov"],
            correct: 2,
            explanation: "A Flashbang é usada para cegar e ensurdecer temporariamente os inimigos.",
            points: 10
        },
        {
            id: 9,
            category: "Armas",
            question: "Qual é a sniper rifle mais cara do jogo?",
            options: ["AWP", "SSG 08", "SCAR-20", "G3SG1"],
            correct: 0,
            explanation: "A AWP custa $4750 e é a sniper rifle mais cara e poderosa do jogo.",
            points: 10
        },
        {
            id: 10,
            category: "Básico",
            question: "O que significa 'eco round'?",
            options: ["Round com granadas", "Round sem comprar nada", "Round de força", "Round de pistola"],
            correct: 1,
            explanation: "Eco round é quando o time não compra equipamentos para economizar dinheiro.",
            points: 10
        }
    ],
    
    medio: [
        {
            id: 11,
            category: "Estratégia",
            question: "O que é um 'force buy'?",
            options: ["Comprar AWP", "Gastar todo dinheiro mesmo sem muito", "Comprar apenas pistolas", "Economizar dinheiro"],
            correct: 1,
            explanation: "Force buy é quando o time gasta todo o dinheiro disponível mesmo sem condições ideais de compra.",
            points: 15
        },
        {
            id: 12,
            category: "Mapas",
            question: "Qual é o callout para a posição atrás das caixas no bombsite A de Mirage?",
            options: ["Default", "Ninja", "Sandwich", "Quad"],
            correct: 1,
            explanation: "A posição atrás das caixas no site A de Mirage é chamada de 'Ninja'.",
            points: 15
        },
        {
            id: 13,
            category: "Armas",
            question: "Qual é a diferença principal entre M4A4 e M4A1-S?",
            options: ["Dano", "Precisão", "Munição e silenciador", "Preço"],
            correct: 2,
            explanation: "M4A4 tem mais munição (30/90) enquanto M4A1-S tem silenciador e menos munição (25/75).",
            points: 15
        },
        {
            id: 14,
            category: "Economia",
            question: "Quanto dinheiro você ganha por eliminar um inimigo com rifle?",
            options: ["$200", "$300", "$500", "$600"],
            correct: 1,
            explanation: "Eliminar um inimigo com rifle rende $300 de recompensa.",
            points: 15
        },
        {
            id: 15,
            category: "Estratégia",
            question: "O que significa 'stack' em CS2?",
            options: ["Empilhar caixas", "Concentrar jogadores em um local", "Comprar em grupo", "Plantar a bomb"],
            correct: 1,
            explanation: "Stack significa concentrar vários jogadores em uma posição específica do mapa.",
            points: 15
        },
        {
            id: 16,
            category: "Mapas",
            question: "Em Inferno, qual é o nome da passagem que conecta os dois bombsites?",
            options: ["Connector", "Mid", "Banana", "Apartments"],
            correct: 3,
            explanation: "Apartments (ou Apps) é a área que conecta os bombsites A e B em Inferno.",
            points: 15
        },
        {
            id: 17,
            category: "Granadas",
            question: "Quanto tempo dura o efeito de uma smoke grenade?",
            options: ["12 segundos", "15 segundos", "18 segundos", "20 segundos"],
            correct: 2,
            explanation: "Uma smoke grenade dura aproximadamente 18 segundos no CS2.",
            points: 15
        },
        {
            id: 18,
            category: "Armas",
            question: "Qual pistola tem o maior dano por tiro?",
            options: ["Glock-18", "USP-S", "Desert Eagle", "P250"],
            correct: 2,
            explanation: "A Desert Eagle é a pistola com maior dano, capaz de matar com headshot mesmo com capacete.",
            points: 15
        },
        {
            id: 19,
            category: "Estratégia",
            question: "O que é 'anti-eco'?",
            options: ["Economizar dinheiro", "Round contra time sem dinheiro", "Comprar apenas pistolas", "Não comprar colete"],
            correct: 1,
            explanation: "Anti-eco é um round onde você joga contra um time que está economizando (eco).",
            points: 15
        },
        {
            id: 20,
            category: "Mapas",
            question: "Qual mapa foi removido do pool competitivo e depois retornou no CS2?",
            options: ["Cache", "Cobblestone", "Train", "Overpass"],
            correct: 0,
            explanation: "Cache foi removido do pool ativo e depois retornou reformulado no CS2.",
            points: 15
        }
    ],
    
    dificil: [
        {
            id: 21,
            category: "Mecânicas",
            question: "Qual é o tick rate padrão dos servidores oficiais do CS2?",
            options: ["64 tick", "128 tick", "Subtick", "256 tick"],
            correct: 2,
            explanation: "CS2 usa o sistema subtick, que substitui o tick rate tradicional por um sistema mais preciso.",
            points: 20
        },
        {
            id: 22,
            category: "Estratégia",
            question: "O que é 'shoulder peeking'?",
            options: ["Mirar no ombro", "Mostrar apenas o ombro", "Atirar por cima do ombro", "Posição de mira"],
            correct: 1,
            explanation: "Shoulder peeking é mostrar apenas o ombro para obter informações sem se expor completamente.",
            points: 20
        },
        {
            id: 23,
            category: "Mapas",
            question: "Quantas posições de plant existem no bombsite B de Dust2?",
            options: ["2", "3", "4", "5"],
            correct: 1,
            explanation: "Existem 3 posições principais de plant no bombsite B de Dust2: default, back plat e close.",
            points: 20
        },
        {
            id: 24,
            category: "Armas",
            question: "Qual é o padrão de recoil da AK-47 nos primeiros 7 tiros?",
            options: ["Subir e direita", "Subir e esquerda", "Apenas subir", "Subir, direita, esquerda"],
            correct: 3,
            explanation: "A AK-47 sobe, vai para direita e depois para esquerda nos primeiros tiros.",
            points: 20
        },
        {
            id: 25,
            category: "Economia",
            question: "Qual é a perda máxima de dinheiro por morte consecutiva?",
            options: ["$1400", "$1900", "$2400", "$3400"],
            correct: 3,
            explanation: "A perda máxima é de $3400 após várias mortes consecutivas sem eliminar ninguém.",
            points: 20
        },
        {
            id: 26,
            category: "Estratégia",
            question: "O que é 'jiggle peeking'?",
            options: ["Peek rápido", "Peek com movimento", "Peek e voltar rapidamente", "Peek agachado"],
            correct: 2,
            explanation: "Jiggle peeking é fazer um peek rápido e voltar imediatamente para cover.",
            points: 20
        },
        {
            id: 27,
            category: "Mapas",
            question: "Em Mirage, qual é a smoke mais importante para tomar o bombsite A?",
            options: ["CT smoke", "Jungle smoke", "Connector smoke", "Stairs smoke"],
            correct: 0,
            explanation: "A CT smoke é crucial para bloquear a rotação dos CTs pelo connector.",
            points: 20
        },
        {
            id: 28,
            category: "Mecânicas",
            question: "Qual é o tempo de defuse da bomb sem kit?",
            options: ["8 segundos", "10 segundos", "12 segundos", "15 segundos"],
            correct: 1,
            explanation: "Defusar a bomb sem kit demora 10 segundos, com kit são 5 segundos.",
            points: 20
        },
        {
            id: 29,
            category: "Armas",
            question: "Qual rifle tem a maior taxa de tiro (RPM)?",
            options: ["AK-47", "M4A4", "Famas", "Galil"],
            correct: 2,
            explanation: "A Famas tem a maior taxa de tiro entre os rifles, especialmente no modo burst.",
            points: 20
        },
        {
            id: 30,
            category: "Estratégia",
            question: "O que é 'baiting' no contexto competitivo?",
            options: ["Usar isca", "Deixar teammate morrer para trade", "Provocar inimigo", "Fingir retreat"],
            correct: 1,
            explanation: "Baiting é usar um teammate como isca, deixando-o morrer para conseguir informação ou trade kill.",
            points: 20
        }
    ],
    
    competitivo: [
        {
            id: 31,
            category: "Pro Scene",
            question: "Qual time venceu o Major de Paris 2023?",
            options: ["FaZe Clan", "Vitality", "NAVI", "G2 Esports"],
            correct: 0,
            explanation: "FaZe Clan venceu o BLAST.tv Paris Major 2023, derrotando NAVI na final.",
            points: 25
        },
        {
            id: 32,
            category: "Estratégia",
            question: "O que é 'anti-stratting'?",
            options: ["Contra-atacar", "Estudar demos do adversário", "Mudar estratégia", "Jogar defensivo"],
            correct: 1,
            explanation: "Anti-stratting é estudar demos e padrões do time adversário para preparar contra-estratégias.",
            points: 25
        },
        {
            id: 33,
            category: "Meta",
            question: "Qual é a formação mais comum no bombsite B de Mirage atualmente?",
            options: ["1 jogador", "2 jogadores", "3 jogadores", "Stack completo"],
            correct: 0,
            explanation: "Atualmente, é comum deixar apenas 1 jogador no B de Mirage, com rotação rápida.",
            points: 25
        },
        {
            id: 34,
            category: "Mecânicas",
            question: "Qual é a diferença de timing entre peek normal e wide peek?",
            options: ["50ms", "100ms", "150ms", "200ms"],
            correct: 2,
            explanation: "Wide peek adiciona aproximadamente 150ms de vantagem de timing sobre o defensor.",
            points: 25
        },
        {
            id: 35,
            category: "Estratégia",
            question: "O que é 'default setup' no lado CT?",
            options: ["2-1-2", "3-1-1", "2-2-1", "1-3-1"],
            correct: 0,
            explanation: "Default setup CT geralmente é 2-1-2: 2 no A, 1 no mid, 2 no B.",
            points: 25
        },
        {
            id: 36,
            category: "Pro Scene",
            question: "Qual jogador é conhecido como 'The Danish Superstar'?",
            options: ["dev1ce", "dupreeh", "Xyp9x", "gla1ve"],
            correct: 0,
            explanation: "dev1ce é conhecido como 'The Danish Superstar' e é um dos maiores AWPers da história.",
            points: 25
        },
        {
            id: 37,
            category: "Mapas",
            question: "Qual é o percentual de vitória médio do lado CT em Dust2 no nível profissional?",
            options: ["45%", "50%", "55%", "60%"],
            correct: 2,
            explanation: "Dust2 tem aproximadamente 55% de taxa de vitória para o lado CT no nível profissional.",
            points: 25
        },
        {
            id: 38,
            category: "Economia",
            question: "Qual é a estratégia econômica mais eficiente após perder o pistol round?",
            options: ["Force buy", "Full eco", "Semi-buy", "Depende da situação"],
            correct: 1,
            explanation: "Geralmente é mais eficiente fazer full eco após perder pistol para ter buy completo no 4º round.",
            points: 25
        },
        {
            id: 39,
            category: "Estratégia",
            question: "O que é 'contact play' no CS2?",
            options: ["Jogar junto", "Reagir ao contato", "Comunicação", "Trade kill"],
            correct: 1,
            explanation: "Contact play é adaptar a estratégia baseada no primeiro contato/informação obtida.",
            points: 25
        },
        {
            id: 40,
            category: "Meta",
            question: "Qual é a composição de granadas mais comum para execute no A de Mirage?",
            options: ["2 smokes, 2 flashes", "1 smoke, 3 flashes", "2 smokes, 1 flash, 1 HE", "3 smokes, 1 flash"],
            correct: 0,
            explanation: "A composição mais comum é 2 smokes (CT e Jungle) e 2 flashes para o execute.",
            points: 25
        }
    ]
};

// Função para obter perguntas por dificuldade
function getQuestionsByDifficulty(difficulty, count = 10) {
    const questions = questionsDatabase[difficulty] || [];
    
    // Embaralhar perguntas
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    
    // Retornar o número solicitado de perguntas
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Função para obter pergunta por ID
function getQuestionById(id) {
    for (const difficulty in questionsDatabase) {
        const question = questionsDatabase[difficulty].find(q => q.id === id);
        if (question) return question;
    }
    return null;
}

// Função para obter perguntas por categoria
function getQuestionsByCategory(category, difficulty = null) {
    let allQuestions = [];
    
    if (difficulty) {
        allQuestions = questionsDatabase[difficulty] || [];
    } else {
        // Combinar todas as dificuldades
        for (const diff in questionsDatabase) {
            allQuestions = allQuestions.concat(questionsDatabase[diff]);
        }
    }
    
    return allQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
}

// Função para obter estatísticas das perguntas
function getQuestionsStats() {
    let totalQuestions = 0;
    const categories = new Set();
    const difficulties = Object.keys(questionsDatabase);
    
    for (const difficulty in questionsDatabase) {
        totalQuestions += questionsDatabase[difficulty].length;
        questionsDatabase[difficulty].forEach(q => categories.add(q.category));
    }
    
    return {
        total: totalQuestions,
        categories: Array.from(categories),
        difficulties: difficulties,
        byDifficulty: difficulties.map(diff => ({
            name: diff,
            count: questionsDatabase[diff].length
        }))
    };
}

// Exportar para uso global
window.questionsDatabase = questionsDatabase;
window.getQuestionsByDifficulty = getQuestionsByDifficulty;
window.getQuestionById = getQuestionById;
window.getQuestionsByCategory = getQuestionsByCategory;
window.getQuestionsStats = getQuestionsStats;