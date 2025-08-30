// ===== BANCO DE PERGUNTAS CS2 - QUEM QUER SER MILIONÁRIO EM COUNTER-STRIKE =====

const questionsDatabase = [
    // Perguntas 1-10 (Nível Fácil)
    {
        id: 1,
        category: "Armas e Equipamentos",
        question: "Qual é a arma mais icônica do lado Terrorista no Counter-Strike?",
        options: ["AK-47", "M4A4", "AWP", "Glock-18"],
        correct: 0,
        explanation: "A AK-47 é considerada a arma mais icônica do lado Terrorista no CS2.",
        difficulty: 1
    },
    {
        id: 2,
        category: "Mapas e Callouts",
        question: "Qual é o mapa mais jogado na história do Counter-Strike?",
        options: ["Mirage", "Dust2", "Inferno", "Nuke"],
        correct: 1,
        explanation: "Dust2 é historicamente o mapa mais popular e jogado em toda a série Counter-Strike.",
        difficulty: 1
    },
    {
        id: 3,
        category: "Básico",
        question: "Quantos jogadores há em cada time no modo competitivo padrão?",
        options: ["4", "5", "6", "10"],
        correct: 1,
        explanation: "Cada time tem 5 jogadores no modo competitivo padrão.",
        difficulty: 1
    },
    {
        id: 4,
        category: "Economia",
        question: "Qual é o dinheiro inicial no primeiro round de uma partida competitiva?",
        options: ["$500", "$800", "$1000", "$1400"],
        correct: 1,
        explanation: "Cada jogador começa com $800 no primeiro round (pistol round).",
        difficulty: 1
    },
    {
        id: 5,
        category: "Armas e Equipamentos",
        question: "Qual arma pode matar com um tiro na cabeça mesmo com o inimigo usando capacete?",
        options: ["AK-47", "M4A4", "Famas", "Galil"],
        correct: 0,
        explanation: "A AK-47 é capaz de matar com um headshot mesmo contra inimigos com capacete.",
        difficulty: 1
    },
    {
        id: 6,
        category: "Mapas e Callouts",
        question: "Em qual mapa encontramos o local chamado 'Pit'?",
        options: ["Mirage", "Dust2", "Inferno", "Overpass"],
        correct: 1,
        explanation: "O 'Pit' é uma posição famosa no mapa Dust2, localizada no bombsite A.",
        difficulty: 1
    },
    {
        id: 7,
        category: "Básico",
        question: "Quantos rounds são necessários para vencer uma partida competitiva padrão?",
        options: ["15", "16", "30", "32"],
        correct: 1,
        explanation: "São necessários 16 rounds para vencer uma partida competitiva (MR15).",
        difficulty: 1
    },
    {
        id: 8,
        category: "Granadas",
        question: "Qual granada é usada para cegar temporariamente os inimigos?",
        options: ["HE Grenade", "Smoke Grenade", "Flashbang", "Molotov"],
        correct: 2,
        explanation: "A Flashbang é usada para cegar e ensurdecer temporariamente os inimigos.",
        difficulty: 1
    },
    {
        id: 9,
        category: "Armas e Equipamentos",
        question: "Qual é a sniper rifle mais cara do jogo?",
        options: ["AWP", "SSG 08", "SCAR-20", "G3SG1"],
        correct: 0,
        explanation: "A AWP custa $4750 e é a sniper rifle mais cara e poderosa do jogo.",
        difficulty: 1
    },
    {
        id: 10,
        category: "Economia",
        question: "O que significa 'eco round'?",
        options: ["Round com granadas", "Round sem comprar equipamentos", "Round de força", "Round de pistola"],
        correct: 1,
        explanation: "Eco round é quando o time não compra equipamentos para economizar dinheiro.",
        difficulty: 1
    },
    
    // Perguntas 11-20 (Nível Fácil-Médio)
    {
        id: 11,
        category: "Estratégia e Economia",
        question: "Qual é o nome da estratégia onde os Terroristas correm rapidamente para um bombsite?",
        options: ["Fake", "Rush", "Default", "Split"],
        correct: 1,
        explanation: "'Rush' é quando os Terroristas correm rapidamente para um bombsite sem parar.",
        difficulty: 2
    },
    {
        id: 12,
        category: "Mapas e Callouts",
        question: "Qual mapa tem um trem que passa pelo meio?",
        options: ["Nuke", "Overpass", "Train", "Vertigo"],
        correct: 2,
        explanation: "O mapa Train tem trens que passam pelo meio da área de jogo.",
        difficulty: 2
    },
    {
        id: 13,
        category: "Mecânicas de Jogo",
        question: "Qual tecla é usada por padrão para plantar a bomba?",
        options: ["E", "F", "G", "T"],
        correct: 0,
        explanation: "A tecla E é usada por padrão para plantar a bomba e interagir com objetos.",
        difficulty: 2
    },
    {
        id: 14,
        category: "Armas e Equipamentos",
        question: "Qual pistola é exclusiva dos Counter-Terrorists?",
        options: ["P250", "Five-SeveN", "Tec-9", "Desert Eagle"],
        correct: 1,
        explanation: "A Five-SeveN é uma pistola exclusiva dos Counter-Terrorists.",
        difficulty: 2
    },
    {
        id: 15,
        category: "Pro Scene",
        question: "Qual país é conhecido por produzir muitos jogadores profissionais de CS de alto nível?",
        options: ["Rússia", "Suécia", "Brasil", "China"],
        correct: 1,
        explanation: "A Suécia é conhecida por produzir muitos jogadores profissionais de CS de elite.",
        difficulty: 2
    },
    {
        id: 16,
        category: "História do CS",
        question: "Em que ano foi lançada a primeira versão do Counter-Strike?",
        options: ["1998", "1999", "2000", "2001"],
        correct: 1,
        explanation: "A primeira versão beta do Counter-Strike foi lançada em 1999.",
        difficulty: 2
    },
    {
        id: 17,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo padrão para desarmar a bomba?",
        options: ["3 segundos", "5 segundos", "7 segundos", "10 segundos"],
        correct: 3,
        explanation: "O tempo padrão para desarmar a bomba é de 10 segundos, ou 5 segundos com kit de desarme.",
        difficulty: 2
    },
    {
        id: 18,
        category: "Armas e Equipamentos",
        question: "Qual é o preço do kit de desarme (defuse kit)?",
        options: ["$200", "$400", "$600", "$1000"],
        correct: 1,
        explanation: "O kit de desarme custa $400 e reduz o tempo de desarme da bomba pela metade.",
        difficulty: 2
    },
    {
        id: 19,
        category: "Mapas e Callouts",
        question: "Qual mapa tem um bombsite localizado em uma área chamada 'Apartments'?",
        options: ["Dust2", "Mirage", "Inferno", "Nuke"],
        correct: 2,
        explanation: "No mapa Inferno, o bombsite B tem uma área próxima chamada 'Apartments'.",
        difficulty: 2
    },
    {
        id: 20,
        category: "Economia",
        question: "Quanto dinheiro um jogador recebe por eliminar um inimigo com uma pistola?",
        options: ["$100", "$300", "$600", "$900"],
        correct: 1,
        explanation: "Um jogador recebe $300 por eliminar um inimigo com uma pistola.",
        difficulty: 2
    },
    
    // Perguntas 21-30 (Nível Médio)
    {
        id: 21,
        category: "Armas e Equipamentos",
        question: "Qual arma tem o maior carregador no CS2?",
        options: ["Negev", "M249", "P90", "MP9"],
        correct: 0,
        explanation: "A Negev tem o maior carregador com 150 balas.",
        difficulty: 3
    },
    {
        id: 22,
        category: "Mecânicas de Jogo",
        question: "Qual é o valor máximo de dinheiro que um jogador pode ter?",
        options: ["$10,000", "$12,000", "$16,000", "$20,000"],
        correct: 2,
        explanation: "O valor máximo de dinheiro que um jogador pode ter é $16,000.",
        difficulty: 3
    },
    {
        id: 23,
        category: "Pro Scene",
        question: "Qual jogador é conhecido como 's1mple'?",
        options: ["Nikola Kovač", "Oleksandr Kostyliev", "Mathieu Herbaut", "Nicolai Reedtz"],
        correct: 1,
        explanation: "Oleksandr Kostyliev é conhecido pelo nickname 's1mple', um dos melhores jogadores da história.",
        difficulty: 3
    },
    {
        id: 24,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Palace'?",
        options: ["Dust2", "Mirage", "Inferno", "Nuke"],
        correct: 1,
        explanation: "'Palace' é uma área no mapa Mirage, próxima ao bombsite A.",
        difficulty: 3
    },
    {
        id: 25,
        category: "Estratégia e Economia",
        question: "O que significa a sigla 'IGL' no contexto de Counter-Strike?",
        options: ["In-Game Leader", "International Gaming League", "Individual Game Level", "Intense Gunfight Logic"],
        correct: 0,
        explanation: "IGL significa 'In-Game Leader', o jogador que lidera a equipe e chama as estratégias.",
        difficulty: 3
    },
    {
        id: 26,
        category: "História do CS",
        question: "Qual foi o primeiro grande torneio de Counter-Strike?",
        options: ["CPL", "ESL", "DreamHack", "ESWC"],
        correct: 0,
        explanation: "A Cyberathlete Professional League (CPL) foi o primeiro grande torneio de Counter-Strike.",
        difficulty: 3
    },
    {
        id: 27,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo padrão de explosão da bomba após ser plantada?",
        options: ["30 segundos", "35 segundos", "40 segundos", "45 segundos"],
        correct: 2,
        explanation: "A bomba explode 40 segundos após ser plantada.",
        difficulty: 3
    },
    {
        id: 28,
        category: "Armas e Equipamentos",
        question: "Qual é a única arma que permite zoom sem ser uma sniper?",
        options: ["AUG", "SG 553", "FAMAS", "Ambas AUG e SG 553"],
        correct: 3,
        explanation: "Tanto a AUG (CT) quanto a SG 553 (T) permitem zoom sem serem snipers.",
        difficulty: 3
    },
    {
        id: 29,
        category: "Mapas e Callouts",
        question: "Qual mapa tem uma área chamada 'Banana'?",
        options: ["Dust2", "Mirage", "Inferno", "Overpass"],
        correct: 2,
        explanation: "'Banana' é uma área no mapa Inferno que leva ao bombsite B.",
        difficulty: 3
    },
    {
        id: 30,
        category: "Economia",
        question: "Quanto dinheiro um time recebe por perder um round com a bomba plantada?",
        options: ["$1400", "$1900", "$2400", "$2900"],
        correct: 1,
        explanation: "Um time recebe $1900 por perder um round com a bomba plantada.",
        difficulty: 3
    },
    
    // Perguntas 31-40 (Nível Médio-Difícil)
    {
        id: 31,
        category: "Armas e Equipamentos",
        question: "Qual é a taxa de fogo (disparos por minuto) aproximada da AK-47?",
        options: ["500", "600", "700", "800"],
        correct: 1,
        explanation: "A AK-47 tem uma taxa de fogo de aproximadamente 600 disparos por minuto.",
        difficulty: 4
    },
    {
        id: 32,
        category: "Mecânicas de Jogo",
        question: "Qual é o alcance máximo de dano da HE Grenade?",
        options: ["3 metros", "5 metros", "7 metros", "10 metros"],
        correct: 2,
        explanation: "A HE Grenade causa dano em um raio de aproximadamente 7 metros.",
        difficulty: 4
    },
    {
        id: 33,
        category: "Pro Scene",
        question: "Qual equipe venceu o primeiro Major de CS:GO?",
        options: ["Fnatic", "Ninjas in Pyjamas", "Virtus.pro", "Team LDLC"],
        correct: 0,
        explanation: "Fnatic venceu o primeiro Major de CS:GO (DreamHack Winter 2013).",
        difficulty: 4
    },
    {
        id: 34,
        category: "Mapas e Callouts",
        question: "Qual mapa tem uma área chamada 'Squeaky'?",
        options: ["Cache", "Dust2", "Mirage", "Nuke"],
        correct: 3,
        explanation: "'Squeaky' é uma área no mapa Nuke, referindo-se a uma porta que faz barulho ao abrir.",
        difficulty: 4
    },
    {
        id: 35,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Split A'?",
        options: ["Atacar o bombsite A por um único caminho", "Atacar o bombsite A por múltiplos caminhos", "Dividir o time entre os bombsites A e B", "Fazer fake no A e atacar o B"],
        correct: 1,
        explanation: "'Split A' significa atacar o bombsite A por múltiplos caminhos simultaneamente.",
        difficulty: 4
    },
    {
        id: 36,
        category: "História do CS",
        question: "Qual foi o último Major disputado no Counter-Strike 1.6?",
        options: ["IEM VI", "WCG 2011", "ESWC 2012", "DreamHack Winter 2012"],
        correct: 1,
        explanation: "O World Cyber Games (WCG) 2011 foi o último Major disputado no Counter-Strike 1.6.",
        difficulty: 4
    },
    {
        id: 37,
        category: "Mecânicas de Jogo",
        question: "Qual é a velocidade de movimento padrão de um jogador com a faca equipada?",
        options: ["215 unidades/s", "230 unidades/s", "250 unidades/s", "260 unidades/s"],
        correct: 2,
        explanation: "A velocidade padrão com a faca equipada é de 250 unidades por segundo.",
        difficulty: 4
    },
    {
        id: 38,
        category: "Armas e Equipamentos",
        question: "Qual arma tem o maior dano por bala no CS2?",
        options: ["AWP", "Desert Eagle", "R8 Revolver", "SSG 08"],
        correct: 0,
        explanation: "A AWP tem o maior dano por bala, podendo matar com um único tiro em quase qualquer parte do corpo.",
        difficulty: 4
    },
    {
        id: 39,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Connector'?",
        options: ["Dust2", "Mirage", "Inferno", "Todas as anteriores"],
        correct: 1,
        explanation: "'Connector' é uma área no mapa Mirage que conecta Mid a Short A.",
        difficulty: 4
    },
    {
        id: 40,
        category: "Economia",
        question: "Qual é o bônus máximo por perder rounds consecutivos?",
        options: ["$2400", "$2900", "$3400", "$3900"],
        correct: 2,
        explanation: "O bônus máximo por perder rounds consecutivos é de $3400.",
        difficulty: 4
    },
    
    // Perguntas 41-50 (Nível Difícil)
    {
        id: 41,
        category: "Armas e Equipamentos",
        question: "Qual é a penetração de parede da AWP em comparação com outras armas?",
        options: ["Baixa", "Média", "Alta", "Muito Alta"],
        correct: 3,
        explanation: "A AWP tem penetração de parede 'Muito Alta', a melhor do jogo.",
        difficulty: 5
    },
    {
        id: 42,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para uma Smoke Grenade se dissipar completamente?",
        options: ["15 segundos", "17,5 segundos", "18 segundos", "20 segundos"],
        correct: 1,
        explanation: "Uma Smoke Grenade dura exatamente 17,5 segundos antes de se dissipar completamente.",
        difficulty: 5
    },
    {
        id: 43,
        category: "Pro Scene",
        question: "Qual jogador tem o recorde de mais MVPs em Majors de CS:GO?",
        options: ["s1mple", "device", "coldzera", "NiKo"],
        correct: 1,
        explanation: "Nicolai 'device' Reedtz tem o recorde de mais MVPs em Majors de CS:GO.",
        difficulty: 5
    },
    {
        id: 44,
        category: "Mapas e Callouts",
        question: "Qual mapa tem uma área chamada 'Olof'?",
        options: ["Overpass", "Mirage", "Inferno", "Dust2"],
        correct: 0,
        explanation: "'Olof' é uma posição no mapa Overpass, nomeada após uma jogada famosa de Olofmeister.",
        difficulty: 5
    },
    {
        id: 45,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Contact play'?",
        options: ["Jogar agressivamente", "Avançar sem usar utilidades até encontrar inimigos", "Usar todas as granadas disponíveis", "Jogar para informação"],
        correct: 1,
        explanation: "'Contact play' é avançar silenciosamente sem usar utilidades até encontrar inimigos.",
        difficulty: 5
    },
    {
        id: 46,
        category: "História do CS",
        question: "Qual foi o primeiro mapa criado especificamente para o modo de jogo 'defuse' no Counter-Strike?",
        options: ["Dust", "Aztec", "Nuke", "Inferno"],
        correct: 0,
        explanation: "Dust foi o primeiro mapa criado especificamente para o modo de jogo 'defuse'.",
        difficulty: 5
    },
    {
        id: 47,
        category: "Mecânicas de Jogo",
        question: "Qual é o ângulo máximo que um jogador pode virar sem fazer barulho de passos?",
        options: ["30 graus", "45 graus", "60 graus", "90 graus"],
        correct: 1,
        explanation: "Um jogador pode virar até 45 graus sem fazer barulho de passos.",
        difficulty: 5
    },
    {
        id: 48,
        category: "Armas e Equipamentos",
        question: "Qual é o padrão de spray da AK-47 nos primeiros 10 tiros?",
        options: ["Para cima e direita", "Para cima e esquerda", "Para cima, depois para direita", "Para cima, depois para esquerda"],
        correct: 3,
        explanation: "O padrão de spray da AK-47 vai para cima nos primeiros tiros e depois desvia para a esquerda.",
        difficulty: 5
    },
    {
        id: 49,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Ninja'?",
        options: ["Dust2", "Mirage", "Inferno", "Cache"],
        correct: 1,
        explanation: "'Ninja' é uma posição no bombsite A de Mirage, onde jogadores podem se esconder para defuses surpresa.",
        difficulty: 5
    },
    {
        id: 50,
        category: "Economia",
        question: "Quanto dinheiro um jogador recebe por plantar a bomba?",
        options: ["$200", "$300", "$500", "$800"],
        correct: 2,
        explanation: "O jogador que planta a bomba recebe $500 adicionais.",
        difficulty: 5
    },
    
    // Perguntas 51-60 (Nível Difícil-Especialista)
    {
        id: 51,
        category: "Armas e Equipamentos",
        question: "Qual é a diferença de dano entre a M4A4 e a M4A1-S?",
        options: ["M4A4 causa mais dano", "M4A1-S causa mais dano", "Ambas causam o mesmo dano", "Depende da distância"],
        correct: 1,
        explanation: "A M4A1-S causa ligeiramente mais dano que a M4A4.",
        difficulty: 6
    },
    {
        id: 52,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para um jogador se recuperar completamente da cegueira de uma flashbang?",
        options: ["2,5 segundos", "3,1 segundos", "4,2 segundos", "5,0 segundos"],
        correct: 1,
        explanation: "Um jogador leva aproximadamente 3,1 segundos para se recuperar completamente da cegueira de uma flashbang direta.",
        difficulty: 6
    },
    {
        id: 53,
        category: "Pro Scene",
        question: "Qual jogador é conhecido pela jogada 'Jumping Double AWP' em Dust2?",
        options: ["kennyS", "s1mple", "GuardiaN", "coldzera"],
        correct: 3,
        explanation: "Marcelo 'coldzera' David ficou famoso pela jogada 'Jumping Double AWP' em Dust2 contra a Team Liquid.",
        difficulty: 6
    },
    {
        id: 54,
        category: "Mapas e Callouts",
        question: "Qual mapa tem uma área chamada 'Sandwich'?",
        options: ["Dust2", "Mirage", "Inferno", "Nuke"],
        correct: 1,
        explanation: "'Sandwich' é uma posição no mapa Mirage, entre Tetris e Stairs no bombsite A.",
        difficulty: 6
    },
    {
        id: 55,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Double Fake'?",
        options: ["Fingir atacar um bombsite duas vezes", "Fingir atacar dois bombsites antes de atacar um terceiro", "Fingir atacar um bombsite e depois outro antes de voltar ao primeiro", "Dois jogadores fingem atacar enquanto o resto do time espera"],
        correct: 2,
        explanation: "'Double Fake' é quando um time finge atacar um bombsite, depois outro, antes de voltar e atacar o primeiro.",
        difficulty: 6
    },
    {
        id: 56,
        category: "História do CS",
        question: "Qual foi o primeiro torneio a oferecer um prêmio de $1 milhão para Counter-Strike?",
        options: ["ESL One Cologne 2015", "MLG Columbus 2016", "ELEAGUE Major 2017", "DreamHack Winter 2013"],
        correct: 2,
        explanation: "O ELEAGUE Major 2017 foi o primeiro torneio a oferecer um prêmio de $1 milhão para Counter-Strike.",
        difficulty: 6
    },
    {
        id: 57,
        category: "Mecânicas de Jogo",
        question: "Qual é a velocidade de movimento quando agachado (crouch) com a faca equipada?",
        options: ["110 unidades/s", "130 unidades/s", "150 unidades/s", "170 unidades/s"],
        correct: 1,
        explanation: "A velocidade de movimento quando agachado com a faca é de aproximadamente 130 unidades por segundo.",
        difficulty: 6
    },
    {
        id: 58,
        category: "Armas e Equipamentos",
        question: "Qual arma tem a maior precisão ao disparar parado?",
        options: ["AK-47", "M4A1-S", "SG 553", "AUG"],
        correct: 1,
        explanation: "A M4A1-S tem a maior precisão ao disparar parado entre as armas principais.",
        difficulty: 6
    },
    {
        id: 59,
        category: "Estratégia e Economia",
        question: "O que é um 'force buy'?",
        options: ["Comprar AWP", "Gastar todo dinheiro mesmo sem economia ideal", "Comprar apenas pistolas", "Economizar dinheiro"],
            correct: 1,
        explanation: "Force buy é quando o time gasta todo o dinheiro disponível mesmo sem condições ideais de compra.",
        difficulty: 6
    },
    {
        id: 60,
        category: "Mapas e Callouts",
        question: "Qual mapa tem uma área chamada 'Heaven'?",
        options: ["Dust2", "Nuke", "Inferno", "Vertigo"],
        correct: 1,
        explanation: "'Heaven' é uma área elevada no mapa Nuke, acima do bombsite B.",
        difficulty: 6
    },
    
    // Perguntas 61-70 (Nível Especialista)
    {
        id: 61,
        category: "Armas e Equipamentos",
        question: "Qual é o valor de dano base da AK-47 sem considerar a localização do tiro?",
        options: ["28", "31", "36", "39"],
        correct: 2,
        explanation: "O dano base da AK-47 é de 36 pontos, sem considerar a localização do tiro.",
        difficulty: 7
    },
    {
        id: 62,
        category: "Mecânicas de Jogo",
        question: "Qual é a velocidade de movimento quando agachado (crouch) com a AWP equipada?",
        options: ["77 unidades/s", "85 unidades/s", "95 unidades/s", "100 unidades/s"],
        correct: 1,
        explanation: "A velocidade de movimento quando agachado com a AWP é de aproximadamente 85 unidades por segundo.",
        difficulty: 7
    },
    {
        id: 63,
        category: "Pro Scene",
        question: "Qual jogador detém o recorde de maior rating em um Major de CS:GO?",
        options: ["s1mple", "ZywOo", "NiKo", "device"],
        correct: 0,
        explanation: "Oleksandr 's1mple' Kostyliev detém o recorde de maior rating em um Major de CS:GO.",
        difficulty: 7
    },
    {
        id: 64,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Toxic'?",
        options: ["Overpass", "Nuke", "Train", "Cache"],
        correct: 1,
        explanation: "'Toxic' é uma área no mapa Nuke, localizada no bombsite B.",
        difficulty: 7
    },
    {
        id: 65,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Anti-Eco'?",
        options: ["Economizar dinheiro", "Comprar armas caras", "Estratégia contra times que estão economizando", "Jogar sem utilidades"],
        correct: 2,
        explanation: "'Anti-Eco' é uma estratégia adotada contra times que estão economizando (em eco round).",
        difficulty: 7
    },
    {
        id: 66,
        category: "História do CS",
        question: "Qual equipe venceu o maior número de Majors consecutivos?",
        options: ["Fnatic", "Astralis", "SK Gaming/Luminosity", "NIP"],
        correct: 0,
        explanation: "Fnatic venceu três Majors consecutivos: ESL One Katowice 2015, ESL One Cologne 2015 e DreamHack Cluj-Napoca 2015.",
        difficulty: 7
    },
    {
        id: 67,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para trocar entre a faca e a arma principal?",
        options: ["0,5 segundos", "0,75 segundos", "1,0 segundos", "1,25 segundos"],
        correct: 1,
        explanation: "Trocar da faca para a arma principal leva aproximadamente 0,75 segundos.",
        difficulty: 7
    },
    {
        id: 68,
        category: "Armas e Equipamentos",
        question: "Qual é a diferença de preço entre a M4A4 e a M4A1-S?",
        options: ["$0", "$100", "$200", "$300"],
        correct: 2,
        explanation: "A M4A4 custa $3100 e a M4A1-S custa $2900, uma diferença de $200.",
        difficulty: 7
    },
    {
        id: 69,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Popdog'?",
        options: ["Cache", "Train", "Nuke", "Overpass"],
        correct: 1,
        explanation: "'Popdog' é uma área no mapa Train, referindo-se a uma escada que leva a uma sala com um logotipo de cachorro.",
        difficulty: 7
    },
    {
        id: 70,
        category: "Economia",
        question: "Qual é o valor do bônus por eliminar um inimigo com uma faca?",
        options: ["$300", "$500", "$1200", "$1500"],
        correct: 3,
        explanation: "Eliminar um inimigo com a faca concede um bônus de $1500.",
        difficulty: 7
    },
    
    // Perguntas 71-80 (Nível Especialista-Avançado)
    {
        id: 71,
        category: "Armas e Equipamentos",
        question: "Qual é a taxa de fogo (disparos por minuto) da Desert Eagle?",
        options: ["150", "200", "267", "300"],
        correct: 2,
        explanation: "A Desert Eagle tem uma taxa de fogo de aproximadamente 267 disparos por minuto.",
        difficulty: 8
    },
    {
        id: 72,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para recarregar completamente a AWP?",
        options: ["2,5 segundos", "3,0 segundos", "3,7 segundos", "4,2 segundos"],
        correct: 2,
        explanation: "Recarregar completamente a AWP leva aproximadamente 3,7 segundos.",
        difficulty: 8
    },
    {
        id: 73,
        category: "Pro Scene",
        question: "Qual jogador é conhecido como 'The Clutch Minister'?",
        options: ["GeT_RiGhT", "Xyp9x", "shox", "clutchmeister"],
        correct: 1,
        explanation: "Andreas 'Xyp9x' Højsleth é conhecido como 'The Clutch Minister' por sua habilidade em situações de clutch.",
        difficulty: 8
    },
    {
        id: 74,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Diggity'?",
        options: ["Inferno", "Overpass", "Dust2", "Mirage"],
        correct: 0,
        explanation: "'Diggity' é uma área no mapa Inferno, próxima ao bombsite B.",
        difficulty: 8
    },
    {
        id: 75,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Boost'?",
        options: ["Comprar armas para aliados", "Jogar agressivamente", "Subir em cima de um aliado para alcançar posições elevadas", "Usar granadas para acelerar o movimento"],
        correct: 2,
        explanation: "'Boost' é quando um jogador sobe em cima de um aliado para alcançar posições elevadas normalmente inacessíveis.",
        difficulty: 8
    },
    {
        id: 76,
        category: "História do CS",
        question: "Qual foi a primeira equipe brasileira a vencer um Major de CS:GO?",
        options: ["MIBR", "SK Gaming", "Luminosity Gaming", "Imperial"],
        correct: 2,
        explanation: "Luminosity Gaming foi a primeira equipe brasileira a vencer um Major (MLG Columbus 2016).",
        difficulty: 8
    },
    {
        id: 77,
        category: "Mecânicas de Jogo",
        question: "Qual é o alcance máximo de dano da Molotov/Incendiary Grenade?",
        options: ["120 unidades", "150 unidades", "180 unidades", "200 unidades"],
        correct: 1,
        explanation: "A Molotov/Incendiary Grenade causa dano em um raio de aproximadamente 150 unidades.",
        difficulty: 8
    },
    {
        id: 78,
        category: "Armas e Equipamentos",
        question: "Qual é a precisão da primeira bala da AK-47 ao disparar parado?",
        options: ["70%", "77%", "83%", "89%"],
        correct: 1,
        explanation: "A precisão da primeira bala da AK-47 ao disparar parado é de aproximadamente 77%.",
        difficulty: 8
    },
    {
        id: 79,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Jungle'?",
        options: ["Dust2", "Mirage", "Inferno", "Cache"],
        correct: 1,
        explanation: "'Jungle' é uma área no mapa Mirage, entre Connector e Stairs.",
        difficulty: 8
    },
    {
        id: 80,
        category: "Economia",
        question: "Qual é o valor máximo de dinheiro que um jogador pode receber por perder um round?",
        options: ["$1400", "$2900", "$3400", "$3500"],
        correct: 2,
        explanation: "O valor máximo que um jogador pode receber por perder um round é $3400 (após 5 derrotas consecutivas).",
        difficulty: 8
    },
    
    // Perguntas 81-90 (Nível Avançado)
    {
        id: 81,
        category: "Armas e Equipamentos",
        question: "Qual é a penetração de parede da Desert Eagle em comparação com outras pistolas?",
        options: ["Baixa", "Média", "Alta", "Muito Alta"],
        correct: 2,
        explanation: "A Desert Eagle tem penetração de parede 'Alta', a melhor entre as pistolas.",
        difficulty: 9
    },
    {
        id: 82,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para um jogador se recuperar completamente do efeito de uma HE Grenade?",
        options: ["1,5 segundos", "2,2 segundos", "3,0 segundos", "3,5 segundos"],
        correct: 1,
        explanation: "Um jogador leva aproximadamente 2,2 segundos para se recuperar completamente do efeito de uma HE Grenade direta.",
        difficulty: 9
    },
    {
        id: 83,
        category: "Pro Scene",
        question: "Qual jogador é conhecido como 'The Human Highlight Reel'?",
        options: ["kennyS", "s1mple", "ScreaM", "NiKo"],
        correct: 0,
        explanation: "Kenny 'kennyS' Schrub é conhecido como 'The Human Highlight Reel' por suas jogadas espetaculares com a AWP.",
        difficulty: 9
    },
    {
        id: 84,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Cubby'?",
        options: ["Dust2", "Mirage", "Inferno", "Overpass"],
        correct: 0,
        explanation: "'Cubby' é uma pequena área no mapa Dust2, próxima ao Long A.",
        difficulty: 9
    },
    {
        id: 85,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Lurk'?",
        options: ["Jogar agressivamente", "Ficar escondido esperando inimigos", "Separar-se do time para obter informações ou flanquear", "Usar granadas para criar distrações"],
        correct: 2,
        explanation: "'Lurk' é quando um jogador se separa do time para obter informações ou flanquear os inimigos.",
        difficulty: 9
    },
    {
        id: 86,
        category: "História do CS",
        question: "Qual jogador é conhecido como 'The King of Banana'?",
        options: ["GeT_RiGhT", "f0rest", "friberg", "Xizt"],
        correct: 2,
        explanation: "Adam 'friberg' Friberg é conhecido como 'The King of Banana' por seu domínio na área Banana do mapa Inferno.",
        difficulty: 9
    },
    {
        id: 87,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para plantar a bomba?",
        options: ["2,0 segundos", "3,0 segundos", "3,2 segundos", "4,0 segundos"],
        correct: 2,
        explanation: "Plantar a bomba leva exatamente 3,2 segundos.",
        difficulty: 9
    },
    {
        id: 88,
        category: "Armas e Equipamentos",
        question: "Qual é a diferença de precisão entre a AK-47 e a M4A4 na primeira bala?",
        options: ["5%", "7%", "10%", "12%"],
        correct: 2,
        explanation: "A diferença de precisão na primeira bala entre a AK-47 e a M4A4 é de aproximadamente 10%.",
        difficulty: 9
    },
    {
        id: 89,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Shroud'?",
        options: ["Cache", "Dust2", "Mirage", "Overpass"],
        correct: 0,
        explanation: "'Shroud' é uma posição no mapa Cache, nomeada após o jogador profissional Shroud.",
        difficulty: 9
    },
    {
        id: 90,
        category: "Economia",
        question: "Qual é o valor do bônus por eliminar um inimigo com a Zeus x27?",
        options: ["$100", "$300", "$500", "$900"],
        correct: 1,
        explanation: "Eliminar um inimigo com a Zeus x27 concede um bônus de $300.",
        difficulty: 9
    },
    
    // Perguntas 91-100 (Nível Extremo)
    {
        id: 91,
        category: "Armas e Equipamentos",
        question: "Qual é a taxa de recuperação de precisão da Desert Eagle após um tiro?",
        options: ["0,5 segundos", "0,8 segundos", "1,2 segundos", "1,5 segundos"],
        correct: 1,
        explanation: "A Desert Eagle leva aproximadamente 0,8 segundos para recuperar sua precisão após um tiro.",
        difficulty: 10
    },
    {
        id: 92,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para um jogador se recuperar completamente do efeito de uma Molotov/Incendiary Grenade?",
        options: ["1,0 segundos", "1,5 segundos", "2,0 segundos", "2,5 segundos"],
        correct: 2,
        explanation: "Um jogador leva aproximadamente 2,0 segundos para se recuperar completamente do efeito de uma Molotov/Incendiary Grenade.",
        difficulty: 10
    },
    {
        id: 93,
        category: "Pro Scene",
        question: "Qual jogador detém o recorde de mais kills em um único mapa em um Major de CS:GO?",
        options: ["s1mple", "device", "NiKo", "electronic"],
        correct: 2,
        explanation: "Nikola 'NiKo' Kovač detém o recorde de mais kills em um único mapa em um Major de CS:GO.",
        difficulty: 10
    },
    {
        id: 94,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Olofboost'?",
        options: ["Dust2", "Mirage", "Overpass", "Inferno"],
        correct: 2,
        explanation: "'Olofboost' é uma posição no mapa Overpass, famosa por uma jogada polêmica de Olofmeister durante o DreamHack Winter 2014.",
        difficulty: 10
    },
    {
        id: 95,
        category: "Estratégia e Economia",
        question: "O que significa a estratégia 'Swag-7'?",
        options: ["Usar a MAG-7 em rounds de eco", "Usar a MAG-7 em posições agressivas", "Comprar a MAG-7 em vez de rifles", "Usar a MAG-7 para defender bombsites"],
        correct: 1,
        explanation: "'Swag-7' é um termo usado para descrever o uso da MAG-7 em posições agressivas, especialmente por CTs.",
        difficulty: 10
    },
    {
        id: 96,
        category: "História do CS",
        question: "Qual foi o primeiro mapa a ser removido do pool competitivo de CS:GO?",
        options: ["Aztec", "Dust", "Vertigo", "Cobblestone"],
        correct: 0,
        explanation: "Aztec foi o primeiro mapa a ser removido do pool competitivo de CS:GO.",
        difficulty: 10
    },
    {
        id: 97,
        category: "Mecânicas de Jogo",
        question: "Qual é o tempo exato que leva para um jogador se recuperar completamente da surdez causada por uma Flashbang?",
        options: ["1,5 segundos", "2,0 segundos", "2,5 segundos", "3,0 segundos"],
        correct: 1,
        explanation: "Um jogador leva aproximadamente 2,0 segundos para se recuperar completamente da surdez causada por uma Flashbang.",
        difficulty: 10
    },
    {
        id: 98,
        category: "Armas e Equipamentos",
        question: "Qual é a diferença de dano entre um headshot da AK-47 e um headshot da M4A4 contra um inimigo sem capacete?",
        options: ["0", "5", "10", "15"],
        correct: 0,
        explanation: "Não há diferença de dano entre um headshot da AK-47 e um headshot da M4A4 contra um inimigo sem capacete, ambos são letais.",
        difficulty: 10
    },
    {
        id: 99,
        category: "Mapas e Callouts",
        question: "Em qual mapa existe uma área chamada 'Dosia X God Nade'?",
        options: ["Inferno", "Overpass", "Mirage", "Cache"],
        correct: 0,
        explanation: "'Dosia X God Nade' é uma jogada famosa no mapa Inferno, onde Dosia jogou uma granada para danificar jogadores escondidos em Pit durante o PGL Major Krakow 2017.",
        difficulty: 10
    },
    {
        id: 100,
        category: "Economia",
        question: "Qual é o valor máximo de dinheiro que um time pode acumular após vencer 16 rounds consecutivos?",
        options: ["$16,000 por jogador", "$80,000 para o time todo", "$10,000 por jogador", "$50,000 para o time todo"],
        correct: 0,
        explanation: "O valor máximo de dinheiro que um time pode acumular é $16,000 por jogador, o limite individual do jogo.",
        difficulty: 10
    }
];

// Banco de dados de perguntas por categoria
const questionsByCategory = {
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
    const categories = new Set();
    const difficulties = new Set();
    
    questionsDatabase.forEach(q => {
        categories.add(q.category);
        difficulties.add(q.difficulty);
    });
    
    const difficultyArray = Array.from(difficulties).sort((a, b) => a - b);
    
    return {
        total: questionsDatabase.length,
        categories: Array.from(categories),
        difficulties: difficultyArray,
        byDifficulty: difficultyArray.map(diff => ({
            name: `Nível ${diff}`,
            count: questionsDatabase.filter(q => q.difficulty === diff).length
        }))
    };
}

// Exportar para uso global
window.questionsDatabase = questionsDatabase;
window.getQuestionsByDifficulty = getQuestionsByDifficulty;
window.getQuestionById = getQuestionById;
window.getQuestionsByCategory = getQuestionsByCategory;
window.getQuestionsStats = getQuestionsStats;