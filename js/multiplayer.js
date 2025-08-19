// ===== SISTEMA MULTIPLAYER LOCAL =====

class MultiplayerQuiz {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameMode = 'turnos'; // 'turnos' ou 'simultaneo'
        this.maxPlayers = 4;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.gameActive = false;
        this.roundResults = [];
        
        this.initializeMultiplayerUI();
    }

    // Inicializar interface multiplayer
    initializeMultiplayerUI() {
        this.createMultiplayerModal();
    }

    // Criar modal de configuração multiplayer
    createMultiplayerModal() {
        const modal = document.createElement('div');
        modal.id = 'multiplayerModal';
        modal.className = 'hidden';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        modal.innerHTML = `
            <div style="background: var(--cs2-dark); padding: 2rem; border-radius: 1rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h2 style="color: var(--cs2-orange); margin-bottom: 2rem; text-align: center;">🎮 Modo Multiplayer</h2>
                
                <div id="multiplayerSetup">
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Modo de Jogo:</label>
                        <select id="gameModeSelect" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 2px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                            <option value="turnos">Por Turnos (cada jogador responde uma pergunta)</option>
                            <option value="simultaneo">Simultâneo (todos respondem a mesma pergunta)</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Dificuldade:</label>
                        <select id="multiplayerDifficulty" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 2px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                            <option value="facil">Fácil</option>
                            <option value="medio">Médio</option>
                            <option value="dificil">Difícil</option>
                            <option value="competitivo">Competitivo</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: var(--cs2-orange); margin-bottom: 1rem;">Jogadores (2-${this.maxPlayers}):</h3>
                        <div id="playersContainer">
                            <div class="player-input" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="text" placeholder="Nome do Jogador 1" style="flex: 1; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                                <select style="padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                                    <option value="🔴">🔴</option>
                                    <option value="🔵">🔵</option>
                                    <option value="🟢">🟢</option>
                                    <option value="🟡">🟡</option>
                                    <option value="🟣">🟣</option>
                                    <option value="🟠">🟠</option>
                                </select>
                            </div>
                            <div class="player-input" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="text" placeholder="Nome do Jogador 2" style="flex: 1; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                                <select style="padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                                    <option value="🔵">🔵</option>
                                    <option value="🔴">🔴</option>
                                    <option value="🟢">🟢</option>
                                    <option value="🟡">🟡</option>
                                    <option value="🟣">🟣</option>
                                    <option value="🟠">🟠</option>
                                </select>
                            </div>
                        </div>
                        <button onclick="multiplayerQuiz.addPlayer()" style="padding: 0.5rem 1rem; background: var(--cs2-orange); color: white; border: none; border-radius: 0.25rem; cursor: pointer;">+ Adicionar Jogador</button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button onclick="multiplayerQuiz.startMultiplayerGame()" class="btn btn-primary" style="margin-right: 1rem;">Iniciar Jogo</button>
                        <button onclick="multiplayerQuiz.closeMultiplayer()" class="btn btn-secondary">Cancelar</button>
                    </div>
                </div>
                
                <div id="multiplayerGame" class="hidden">
                    <div id="multiplayerHeader" style="margin-bottom: 2rem;">
                        <div id="currentPlayerDisplay" style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem;"></div>
                        <div id="playersScoreboard" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;"></div>
                    </div>
                    
                    <div id="multiplayerQuestion">
                        <!-- Pergunta será inserida aqui -->
                    </div>
                    
                    <div id="multiplayerControls" style="text-align: center; margin-top: 2rem;">
                        <button id="nextPlayerBtn" class="btn btn-primary hidden" onclick="multiplayerQuiz.nextPlayer()">Próximo Jogador</button>
                        <button id="nextQuestionBtn" class="btn btn-primary hidden" onclick="multiplayerQuiz.nextQuestion()">Próxima Pergunta</button>
                        <button id="finishMultiplayerBtn" class="btn btn-primary hidden" onclick="multiplayerQuiz.finishMultiplayerGame()">Finalizar Jogo</button>
                    </div>
                </div>
                
                <div id="multiplayerResults" class="hidden">
                    <h3 style="color: var(--cs2-orange); text-align: center; margin-bottom: 2rem;">🏆 Resultados Finais</h3>
                    <div id="finalRanking"></div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <button onclick="multiplayerQuiz.restartMultiplayer()" class="btn btn-primary" style="margin-right: 1rem;">Jogar Novamente</button>
                        <button onclick="multiplayerQuiz.closeMultiplayer()" class="btn btn-secondary">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    // Abrir modal multiplayer
    openMultiplayer() {
        this.modal.classList.remove('hidden');
        this.resetMultiplayerState();
    }

    // Fechar modal multiplayer
    closeMultiplayer() {
        this.modal.classList.add('hidden');
        this.resetMultiplayerState();
    }

    // Resetar estado multiplayer
    resetMultiplayerState() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentQuestionIndex = 0;
        this.gameActive = false;
        this.roundResults = [];
        
        // Mostrar setup e esconder outras seções
        document.getElementById('multiplayerSetup').classList.remove('hidden');
        document.getElementById('multiplayerGame').classList.add('hidden');
        document.getElementById('multiplayerResults').classList.add('hidden');
    }

    // Adicionar jogador
    addPlayer() {
        const container = document.getElementById('playersContainer');
        const playerCount = container.children.length;
        
        if (playerCount >= this.maxPlayers) {
            alert(`Máximo de ${this.maxPlayers} jogadores permitido!`);
            return;
        }
        
        const colors = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
        const usedColors = Array.from(container.querySelectorAll('select')).map(s => s.value);
        const availableColor = colors.find(color => !usedColors.includes(color)) || '⚪';
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        playerDiv.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;';
        
        playerDiv.innerHTML = `
            <input type="text" placeholder="Nome do Jogador ${playerCount + 1}" style="flex: 1; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
            <select style="padding: 0.5rem; border-radius: 0.25rem; border: 1px solid var(--cs2-orange); background: rgba(255,255,255,0.1); color: white;">
                ${colors.map(color => `<option value="${color}" ${color === availableColor ? 'selected' : ''}>${color}</option>`).join('')}
            </select>
            <button onclick="this.parentElement.remove()" style="padding: 0.5rem; background: var(--cs2-error); color: white; border: none; border-radius: 0.25rem; cursor: pointer;">×</button>
        `;
        
        container.appendChild(playerDiv);
    }

    // Iniciar jogo multiplayer
    startMultiplayerGame() {
        // Coletar dados dos jogadores
        const playerInputs = document.querySelectorAll('.player-input');
        this.players = [];
        
        playerInputs.forEach((input, index) => {
            const nameInput = input.querySelector('input');
            const colorSelect = input.querySelector('select');
            const name = nameInput.value.trim();
            
            if (name) {
                this.players.push({
                    id: index,
                    name: name,
                    color: colorSelect.value,
                    score: 0,
                    correctAnswers: 0,
                    totalAnswers: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    totalTime: 0,
                    answers: []
                });
            }
        });
        
        if (this.players.length < 2) {
            alert('É necessário pelo menos 2 jogadores!');
            return;
        }
        
        // Configurar jogo
        this.gameMode = document.getElementById('gameModeSelect').value;
        const difficulty = document.getElementById('multiplayerDifficulty').value;
        this.currentQuestions = getQuestionsByDifficulty(difficulty, 10);
        
        if (this.currentQuestions.length === 0) {
            alert('Nenhuma pergunta encontrada para esta dificuldade!');
            return;
        }
        
        // Iniciar jogo
        this.gameActive = true;
        this.currentPlayerIndex = 0;
        this.currentQuestionIndex = 0;
        
        // Mostrar interface do jogo
        document.getElementById('multiplayerSetup').classList.add('hidden');
        document.getElementById('multiplayerGame').classList.remove('hidden');
        
        // Carregar primeira pergunta
        this.loadMultiplayerQuestion();
    }

    // Carregar pergunta multiplayer
    loadMultiplayerQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.finishMultiplayerGame();
            return;
        }
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Atualizar display do jogador atual
        if (this.gameMode === 'turnos') {
            const currentPlayer = this.players[this.currentPlayerIndex];
            document.getElementById('currentPlayerDisplay').innerHTML = 
                `<strong>Vez de: ${currentPlayer.color} ${currentPlayer.name}</strong>`;
        } else {
            document.getElementById('currentPlayerDisplay').innerHTML = 
                `<strong>Pergunta ${this.currentQuestionIndex + 1} - Todos respondem!</strong>`;
        }
        
        // Atualizar scoreboard
        this.updateScoreboard();
        
        // Mostrar pergunta
        const questionContainer = document.getElementById('multiplayerQuestion');
        questionContainer.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 1rem;">
                <div style="background: var(--cs2-orange); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; display: inline-block; margin-bottom: 1rem;">
                    ${question.category}
                </div>
                <h3 style="margin-bottom: 2rem; font-size: 1.1rem;">${question.question}</h3>
                <div id="multiplayerAnswers" style="display: grid; gap: 1rem;">
                    ${question.options.map((option, index) => `
                        <button class="multiplayer-answer" data-index="${index}" 
                                style="background: rgba(255,255,255,0.05); border: 2px solid transparent; border-radius: 0.5rem; padding: 1rem; text-align: left; cursor: pointer; transition: all 0.3s;"
                                onclick="multiplayerQuiz.selectMultiplayerAnswer(${index})">
                            <strong>${String.fromCharCode(65 + index)})</strong> ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Resetar controles
        this.hideAllControls();
    }

    // Selecionar resposta multiplayer
    selectMultiplayerAnswer(answerIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        // Desabilitar botões
        const answerButtons = document.querySelectorAll('.multiplayer-answer');
        answerButtons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Marcar resposta
        answerButtons[answerIndex].style.borderColor = isCorrect ? 'var(--cs2-success)' : 'var(--cs2-error)';
        answerButtons[answerIndex].style.backgroundColor = isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        
        // Mostrar resposta correta se errou
        if (!isCorrect) {
            answerButtons[question.correct].style.borderColor = 'var(--cs2-success)';
            answerButtons[question.correct].style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        }
        
        // Processar resposta
        if (this.gameMode === 'turnos') {
            this.processPlayerAnswer(this.currentPlayerIndex, answerIndex, isCorrect);
            this.showNextPlayerButton();
        } else {
            // No modo simultâneo, todos os jogadores respondem
            this.processSimultaneousAnswer(answerIndex, isCorrect);
        }
        
        // Mostrar explicação se disponível
        if (question.explanation) {
            this.showMultiplayerExplanation(question.explanation);
        }
    }

    // Processar resposta do jogador
    processPlayerAnswer(playerIndex, answerIndex, isCorrect) {
        const player = this.players[playerIndex];
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        player.totalAnswers++;
        
        if (isCorrect) {
            player.correctAnswers++;
            player.currentStreak++;
            player.score += question.points || 10;
            
            if (player.currentStreak > player.bestStreak) {
                player.bestStreak = player.currentStreak;
            }
        } else {
            player.currentStreak = 0;
        }
        
        player.answers.push({
            questionIndex: this.currentQuestionIndex,
            answer: answerIndex,
            correct: isCorrect,
            points: isCorrect ? (question.points || 10) : 0
        });
    }

    // Processar resposta simultânea (simplificado para demo)
    processSimultaneousAnswer(answerIndex, isCorrect) {
        // Em um jogo real, você coletaria as respostas de todos os jogadores
        // Para esta demo, vamos simular que todos responderam
        this.players.forEach((player, index) => {
            // Simular respostas aleatórias para outros jogadores
            const playerAnswer = index === 0 ? answerIndex : Math.floor(Math.random() * 4);
            const playerCorrect = index === 0 ? isCorrect : (playerAnswer === this.currentQuestions[this.currentQuestionIndex].correct);
            
            this.processPlayerAnswer(index, playerAnswer, playerCorrect);
        });
        
        this.showNextQuestionButton();
    }

    // Mostrar explicação multiplayer
    showMultiplayerExplanation(explanation) {
        const questionContainer = document.getElementById('multiplayerQuestion');
        const explanationDiv = document.createElement('div');
        explanationDiv.style.cssText = `
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid var(--cs2-orange);
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1rem;
        `;
        explanationDiv.innerHTML = `<strong>💡 Explicação:</strong> ${explanation}`;
        questionContainer.appendChild(explanationDiv);
    }

    // Atualizar scoreboard
    updateScoreboard() {
        const scoreboard = document.getElementById('playersScoreboard');
        scoreboard.innerHTML = this.players.map(player => `
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; text-align: center;">
                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">${player.color}</div>
                <div style="font-weight: bold; margin-bottom: 0.25rem;">${player.name}</div>
                <div style="color: var(--cs2-orange); font-size: 1.1rem; font-weight: bold;">${player.score}</div>
                <div style="font-size: 0.8rem; color: var(--cs2-gray);">${player.correctAnswers}/${player.totalAnswers}</div>
            </div>
        `).join('');
    }

    // Esconder todos os controles
    hideAllControls() {
        document.getElementById('nextPlayerBtn').classList.add('hidden');
        document.getElementById('nextQuestionBtn').classList.add('hidden');
        document.getElementById('finishMultiplayerBtn').classList.add('hidden');
    }

    // Mostrar botão próximo jogador
    showNextPlayerButton() {
        if (this.gameMode === 'turnos') {
            if (this.currentPlayerIndex < this.players.length - 1) {
                document.getElementById('nextPlayerBtn').classList.remove('hidden');
            } else {
                this.showNextQuestionButton();
            }
        }
    }

    // Mostrar botão próxima pergunta
    showNextQuestionButton() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
        } else {
            document.getElementById('finishMultiplayerBtn').classList.remove('hidden');
        }
    }

    // Próximo jogador
    nextPlayer() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.nextQuestion();
        } else {
            this.loadMultiplayerQuestion();
        }
    }

    // Próxima pergunta
    nextQuestion() {
        this.currentQuestionIndex++;
        this.currentPlayerIndex = 0;
        this.loadMultiplayerQuestion();
    }

    // Finalizar jogo multiplayer
    finishMultiplayerGame() {
        this.gameActive = false;
        
        // Ordenar jogadores por pontuação
        const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);
        
        // Mostrar resultados
        document.getElementById('multiplayerGame').classList.add('hidden');
        document.getElementById('multiplayerResults').classList.remove('hidden');
        
        const ranking = document.getElementById('finalRanking');
        ranking.innerHTML = sortedPlayers.map((player, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
            const accuracy = player.totalAnswers > 0 ? Math.round((player.correctAnswers / player.totalAnswers) * 100) : 0;
            
            return `
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2rem;">${medal || position + '°'}</div>
                    <div style="font-size: 1.5rem;">${player.color}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; font-size: 1.1rem;">${player.name}</div>
                        <div style="color: var(--cs2-gray); font-size: 0.9rem;">
                            ${player.correctAnswers}/${player.totalAnswers} acertos (${accuracy}%)
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: var(--cs2-orange); font-size: 1.5rem; font-weight: bold;">${player.score}</div>
                        <div style="color: var(--cs2-gray); font-size: 0.8rem;">pontos</div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Salvar resultado do vencedor
        if (sortedPlayers.length > 0) {
            const winner = sortedPlayers[0];
            const gameData = {
                playerName: `${winner.name} (Multiplayer)`,
                difficulty: document.getElementById('multiplayerDifficulty').value,
                score: winner.correctAnswers,
                totalQuestions: this.currentQuestions.length,
                correctAnswers: winner.correctAnswers,
                totalPoints: winner.score,
                averageTime: 30, // Estimativa
                bestStreak: winner.bestStreak,
                categoryStats: {}
            };
            
            quizStorage.saveGameResult(gameData);
        }
    }

    // Reiniciar multiplayer
    restartMultiplayer() {
        this.resetMultiplayerState();
    }
}

// Instância global do multiplayer
const multiplayerQuiz = new MultiplayerQuiz();

// Função global para abrir multiplayer
function openMultiplayer() {
    multiplayerQuiz.openMultiplayer();
}

// Exportar para uso global
window.multiplayerQuiz = multiplayerQuiz;
window.openMultiplayer = openMultiplayer;