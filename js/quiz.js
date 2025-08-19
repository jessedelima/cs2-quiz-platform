// ===== LÓGICA PRINCIPAL DO QUIZ CS2 =====

class CS2Quiz {
    constructor() {
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalPoints = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.difficulty = 'facil';
        this.playerName = '';
        this.startTime = null;
        this.questionStartTime = null;
        this.totalTime = 0;
        this.questionTimes = [];
        this.categoryStats = {};
        this.timer = null;
        this.timeLeft = 30;
        this.maxTime = 30;
        this.isAnswered = false;
        this.gameActive = false;
        
        // Elementos DOM
        this.elements = {};
        this.initializeElements();
        
        // Configurações
        this.settings = quizStorage.getSettings();
    }

    // Inicializar elementos DOM
    initializeElements() {
        this.elements = {
            // Telas
            welcomeScreen: document.getElementById('welcomeScreen'),
            quizContainer: document.getElementById('quizContainer'),
            resultsScreen: document.getElementById('resultsScreen'),
            rankingScreen: document.getElementById('rankingScreen'),
            statisticsScreen: document.getElementById('statisticsScreen'),
            
            // Quiz elements
            questionCounter: document.getElementById('questionCounter'),
            progressFill: document.getElementById('progressFill'),
            currentScore: document.getElementById('currentScore'),
            correctAnswersEl: document.getElementById('correctAnswers'),
            currentStreak: document.getElementById('currentStreak'),
            timerCircle: document.getElementById('timerCircle'),
            timerValue: document.getElementById('timerValue'),
            questionCategory: document.getElementById('questionCategory'),
            questionText: document.getElementById('questionText'),
            questionImage: document.getElementById('questionImage'),
            answersGrid: document.getElementById('answersGrid'),
            nextButton: document.getElementById('nextButton'),
            finishButton: document.getElementById('finishButton'),
            
            // Results elements
            finalScore: document.getElementById('finalScore'),
            totalPoints: document.getElementById('totalPoints'),
            accuracy: document.getElementById('accuracy'),
            averageTime: document.getElementById('averageTime'),
            bestStreakEl: document.getElementById('bestStreak'),
            performanceMessage: document.getElementById('performanceMessage'),
            
            // Player setup
            playerName: document.getElementById('playerName'),
            
            // Ranking
            rankingList: document.getElementById('rankingList'),
            
            // Statistics
            totalGames: document.getElementById('totalGames'),
            bestScore: document.getElementById('bestScore'),
            overallAccuracy: document.getElementById('overallAccuracy'),
            favoriteCategory: document.getElementById('favoriteCategory')
        };
    }

    // Iniciar quiz
    startQuiz(difficulty) {
        this.difficulty = difficulty;
        this.playerName = this.elements.playerName.value.trim() || 'Anônimo';
        
        // Salvar nome do jogador
        quizStorage.savePlayerName(this.playerName);
        
        // Obter perguntas
        this.currentQuestions = getQuestionsByDifficulty(difficulty, 10);
        
        if (this.currentQuestions.length === 0) {
            alert('Nenhuma pergunta encontrada para esta dificuldade!');
            return;
        }
        
        // Resetar variáveis
        this.resetGameState();
        
        // Configurar timer baseado na dificuldade
        this.setTimerByDifficulty(difficulty);
        
        // Mostrar container do quiz
        this.showScreen('quiz');
        
        // Iniciar primeira pergunta
        this.loadQuestion();
        
        this.gameActive = true;
        this.startTime = Date.now();
        
        // Tocar som de início (se habilitado)
        this.playSound('start');
    }

    // Resetar estado do jogo
    resetGameState() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalPoints = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalTime = 0;
        this.questionTimes = [];
        this.categoryStats = {};
        this.isAnswered = false;
    }

    // Configurar timer baseado na dificuldade
    setTimerByDifficulty(difficulty) {
        const timers = {
            facil: 45,
            medio: 30,
            dificil: 25,
            competitivo: 20
        };
        
        this.maxTime = timers[difficulty] || 30;
        this.timeLeft = this.maxTime;
    }

    // Carregar pergunta atual
    loadQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.finishQuiz();
            return;
        }
        
        this.currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        this.isAnswered = false;
        this.timeLeft = this.maxTime;
        this.questionStartTime = Date.now();
        
        // Atualizar UI
        this.updateQuestionUI();
        this.updateProgressUI();
        this.updateStatsUI();
        
        // Iniciar timer
        this.startTimer();
        
        // Adicionar animação
        if (this.settings.animations) {
            this.elements.questionCard.classList.add('fade-in');
            setTimeout(() => {
                this.elements.questionCard.classList.remove('fade-in');
            }, 500);
        }
    }

    // Atualizar UI da pergunta
    updateQuestionUI() {
        const question = this.currentQuestion;
        
        // Categoria
        this.elements.questionCategory.textContent = question.category;
        
        // Pergunta
        this.elements.questionText.textContent = question.question;
        
        // Imagem (se houver)
        if (question.image) {
            this.elements.questionImage.src = question.image;
            this.elements.questionImage.classList.remove('hidden');
        } else {
            this.elements.questionImage.classList.add('hidden');
        }
        
        // Opções de resposta
        this.elements.answersGrid.innerHTML = '';
        question.options.forEach((option, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.onclick = () => this.selectAnswer(index);
            
            answerDiv.innerHTML = `
                <div class="answer-letter">${String.fromCharCode(65 + index)}</div>
                <div class="answer-text">${option}</div>
            `;
            
            this.elements.answersGrid.appendChild(answerDiv);
        });
        
        // Esconder botões
        this.elements.nextButton.classList.add('hidden');
        this.elements.finishButton.classList.add('hidden');
    }

    // Atualizar UI do progresso
    updateProgressUI() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.questionCounter.textContent = `${this.currentQuestionIndex + 1}/${this.currentQuestions.length}`;
    }

    // Atualizar UI das estatísticas
    updateStatsUI() {
        this.elements.currentScore.textContent = this.score;
        this.elements.correctAnswersEl.textContent = this.correctAnswers;
        this.elements.currentStreak.textContent = this.currentStreak;
    }

    // Iniciar timer
    startTimer() {
        this.clearTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
        
        this.updateTimerUI();
    }

    // Atualizar UI do timer
    updateTimerUI() {
        this.elements.timerValue.textContent = this.timeLeft;
        
        // Atualizar círculo do timer
        const percentage = (this.timeLeft / this.maxTime) * 360;
        const color = this.timeLeft <= 5 ? '#ef4444' : '#ff6b35';
        
        this.elements.timerCircle.style.background = 
            `conic-gradient(${color} ${percentage}deg, rgba(255, 255, 255, 0.1) ${percentage}deg)`;
        
        // Adicionar efeito de pulsação quando tempo baixo
        if (this.timeLeft <= 5 && this.settings.animations) {
            this.elements.timerCircle.classList.add('pulse');
        } else {
            this.elements.timerCircle.classList.remove('pulse');
        }
    }

    // Tempo esgotado
    timeUp() {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        this.clearTimer();
        
        // Marcar como incorreta
        this.processAnswer(-1, true);
        
        // Tocar som de tempo esgotado
        this.playSound('timeout');
    }

    // Limpar timer
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // Selecionar resposta
    selectAnswer(answerIndex) {
        if (this.isAnswered || !this.gameActive) return;
        
        this.isAnswered = true;
        this.clearTimer();
        
        // Calcular tempo da resposta
        const responseTime = (Date.now() - this.questionStartTime) / 1000;
        this.questionTimes.push(responseTime);
        
        // Processar resposta
        this.processAnswer(answerIndex);
    }

    // Processar resposta
    processAnswer(answerIndex, isTimeout = false) {
        const question = this.currentQuestion;
        const isCorrect = answerIndex === question.correct;
        
        // Atualizar estatísticas da categoria
        if (!this.categoryStats[question.category]) {
            this.categoryStats[question.category] = { correct: 0, total: 0 };
        }
        this.categoryStats[question.category].total++;
        
        // Marcar opções visualmente
        const options = this.elements.answersGrid.children;
        
        if (isTimeout) {
            // Mostrar resposta correta quando tempo esgota
            options[question.correct].classList.add('correct');
        } else {
            // Marcar resposta selecionada
            options[answerIndex].classList.add('selected');
            
            if (isCorrect) {
                options[answerIndex].classList.add('correct');
            } else {
                options[answerIndex].classList.add('incorrect');
                // Mostrar resposta correta
                options[question.correct].classList.add('correct');
            }
        }
        
        // Desabilitar todas as opções
        Array.from(options).forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Processar resultado
        if (isCorrect && !isTimeout) {
            this.correctAnswers++;
            this.currentStreak++;
            this.categoryStats[question.category].correct++;
            
            // Calcular pontos (baseado na dificuldade, tempo e sequência)
            const basePoints = question.points || this.getBasePoints();
            const timeBonus = Math.max(0, Math.floor((this.timeLeft / this.maxTime) * 10));
            const streakBonus = Math.min(this.currentStreak * 2, 20);
            const totalQuestionPoints = basePoints + timeBonus + streakBonus;
            
            this.totalPoints += totalQuestionPoints;
            this.score++;
            
            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
            }
            
            // Tocar som de acerto
            this.playSound('correct');
        } else {
            this.currentStreak = 0;
            // Tocar som de erro
            this.playSound('incorrect');
        }
        
        // Mostrar explicação se disponível
        if (question.explanation) {
            this.showExplanation(question.explanation);
        }
        
        // Mostrar botão de próxima pergunta
        setTimeout(() => {
            if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
                this.elements.nextButton.classList.remove('hidden');
            } else {
                this.elements.finishButton.classList.remove('hidden');
            }
        }, 1000);
        
        // Atualizar UI
        this.updateStatsUI();
    }

    // Obter pontos base por dificuldade
    getBasePoints() {
        const points = {
            facil: 10,
            medio: 15,
            dificil: 20,
            competitivo: 25
        };
        return points[this.difficulty] || 10;
    }

    // Mostrar explicação
    showExplanation(explanation) {
        // Criar elemento de explicação temporário
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.style.cssText = `
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid var(--cs2-orange);
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        explanationDiv.innerHTML = `<strong>💡 Explicação:</strong> ${explanation}`;
        
        this.elements.answersGrid.appendChild(explanationDiv);
        
        if (this.settings.animations) {
            explanationDiv.classList.add('fade-in');
        }
    }

    // Próxima pergunta
    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    // Finalizar quiz
    finishQuiz() {
        this.gameActive = false;
        this.clearTimer();
        
        // Calcular estatísticas finais
        this.totalTime = (Date.now() - this.startTime) / 1000;
        const averageTime = this.questionTimes.length > 0 
            ? Math.round(this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length)
            : 0;
        
        // Dados do jogo para salvar
        const gameData = {
            playerName: this.playerName,
            difficulty: this.difficulty,
            score: this.score,
            totalQuestions: this.currentQuestions.length,
            correctAnswers: this.correctAnswers,
            totalPoints: this.totalPoints,
            averageTime: averageTime,
            bestStreak: this.bestStreak,
            categoryStats: this.categoryStats
        };
        
        // Salvar resultado
        const savedGame = quizStorage.saveGameResult(gameData);
        
        // Mostrar resultados
        this.showResults(savedGame);
        
        // Tocar som de finalização
        this.playSound('finish');
    }

    // Mostrar resultados
    showResults(gameData) {
        // Atualizar elementos de resultado
        this.elements.finalScore.textContent = `${gameData.score}/${gameData.totalQuestions}`;
        this.elements.totalPoints.textContent = `${gameData.totalPoints} pontos`;
        this.elements.accuracy.textContent = `${gameData.accuracy}%`;
        this.elements.averageTime.textContent = `${gameData.averageTime}s`;
        this.elements.bestStreakEl.textContent = gameData.bestStreak;
        
        // Mensagem de performance
        const performanceMessage = this.getPerformanceMessage(gameData.accuracy);
        this.elements.performanceMessage.innerHTML = performanceMessage;
        
        // Mostrar tela de resultados
        this.showScreen('results');
    }

    // Obter mensagem de performance
    getPerformanceMessage(accuracy) {
        if (accuracy === 100) {
            return '🏆 <strong>Perfeito!</strong> Você é um verdadeiro especialista em CS2!';
        } else if (accuracy >= 80) {
            return '🔥 <strong>Excelente!</strong> Você domina muito bem o CS2!';
        } else if (accuracy >= 60) {
            return '👍 <strong>Bom trabalho!</strong> Continue praticando para melhorar!';
        } else if (accuracy >= 40) {
            return '📚 <strong>Pode melhorar!</strong> Que tal estudar mais sobre CS2?';
        } else {
            return '💪 <strong>Continue tentando!</strong> A prática leva à perfeição!';
        }
    }

    // Tocar som
    playSound(type) {
        if (!this.settings.soundEffects) return;
        
        // Criar contexto de áudio se não existir
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Frequências para diferentes sons
        const frequencies = {
            correct: [523, 659, 784], // C, E, G
            incorrect: [220, 185], // A, F#
            timeout: [147, 131], // D, C
            start: [392, 523], // G, C
            finish: [523, 659, 784, 1047] // C, E, G, C
        };
        
        const freq = frequencies[type] || [440];
        this.playTone(freq, 0.3);
    }

    // Tocar tom
    playTone(frequencies, duration) {
        if (!this.audioContext) return;
        
        const volume = this.settings.volume / 100;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime + index * 0.1);
            oscillator.stop(this.audioContext.currentTime + duration + index * 0.1);
        });
    }

    // Mostrar tela
    showScreen(screen) {
        // Esconder todas as telas
        Object.values(this.elements).forEach(element => {
            if (element && element.classList && element.classList.contains('hidden') === false) {
                if (element.id && (element.id.includes('Screen') || element.id.includes('Container'))) {
                    element.classList.add('hidden');
                }
            }
        });
        
        // Mostrar tela solicitada
        switch (screen) {
            case 'welcome':
                this.elements.welcomeScreen.classList.remove('hidden');
                break;
            case 'quiz':
                this.elements.quizContainer.classList.remove('hidden');
                break;
            case 'results':
                this.elements.resultsScreen.classList.remove('hidden');
                break;
            case 'ranking':
                this.elements.rankingScreen.classList.remove('hidden');
                this.loadRanking();
                break;
            case 'statistics':
                this.elements.statisticsScreen.classList.remove('hidden');
                this.loadStatistics();
                break;
        }
    }

    // Carregar ranking
    loadRanking() {
        const ranking = quizStorage.getRanking(10);
        this.elements.rankingList.innerHTML = '';
        
        ranking.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'ranking-row';
            
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
            
            row.innerHTML = `
                <div class="ranking-position">${medal} ${position}</div>
                <div>${player.name}</div>
                <div>${player.bestScore}</div>
                <div>${player.accuracy}%</div>
            `;
            
            this.elements.rankingList.appendChild(row);
        });
        
        if (ranking.length === 0) {
            this.elements.rankingList.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--cs2-gray);">Nenhum resultado ainda. Seja o primeiro!</div>';
        }
    }

    // Carregar estatísticas
    loadStatistics() {
        const stats = quizStorage.getPlayerStats();
        
        this.elements.totalGames.textContent = stats.totalGames;
        this.elements.bestScore.textContent = stats.bestScore;
        this.elements.overallAccuracy.textContent = `${stats.overallAccuracy}%`;
        this.elements.favoriteCategory.textContent = stats.favoriteCategory || 'Nenhuma';
    }

    // Reiniciar quiz
    restartQuiz() {
        this.startQuiz(this.difficulty);
    }

    // Compartilhar resultados
    shareResults() {
        const text = `🎯 Acabei de fazer ${this.score}/${this.currentQuestions.length} no Quiz CS2 (${this.difficulty})!\n` +
                    `💯 Precisão: ${Math.round((this.correctAnswers / this.currentQuestions.length) * 100)}%\n` +
                    `🔥 Melhor sequência: ${this.bestStreak}\n` +
                    `⚡ Pontos: ${this.totalPoints}\n\n` +
                    `Teste seus conhecimentos sobre Counter-Strike 2!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Quiz CS2 - Meus Resultados',
                text: text
            });
        } else {
            // Fallback para copiar para clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Resultado copiado para a área de transferência!');
            });
        }
    }
}

// Instância global do quiz
const cs2Quiz = new CS2Quiz();

// Exportar para uso global
window.cs2Quiz = cs2Quiz;