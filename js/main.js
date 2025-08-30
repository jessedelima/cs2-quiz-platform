// ===== ARQUIVO PRINCIPAL - GERENCIAMENTO DA APLICAÇÃO =====

// Variáveis globais
let currentScreen = 'welcome';
let settingsModal = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar aplicação
function initializeApp() {
    console.log('🎯 Iniciando Quiz CS2...');
    
    // Carregar configurações
    loadSettings();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar estatísticas do banco de perguntas
    displayQuestionStats();
    
    // Verificar se há dados salvos
    checkSavedData();
    
    console.log('✅ Quiz CS2 inicializado com sucesso!');
}

// Configurar event listeners
function setupEventListeners() {
    // Teclas de atalho
    document.addEventListener('keydown', handleKeyPress);
    
    // Redimensionamento da janela
    window.addEventListener('resize', handleResize);
    
    // Visibilidade da página (pausar timer quando não visível)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Configurar modal de configurações
    setupSettingsModal();
}

// Gerenciar teclas de atalho
function handleKeyPress(event) {
    // Não processar se estiver digitando
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key) {
        case 'Escape':
            if (currentScreen === 'quiz') {
                if (confirm('Tem certeza que deseja sair do quiz? O progresso será perdido.')) {
                    showWelcomeScreen();
                }
            }
            break;
            
        case '1':
        case '2':
        case '3':
        case '4':
            if (currentScreen === 'quiz' && cs2Quiz.gameActive && !cs2Quiz.isAnswered) {
                const answerIndex = parseInt(event.key) - 1;
                if (answerIndex < cs2Quiz.currentQuestion.options.length) {
                    cs2Quiz.selectAnswer(answerIndex);
                }
            }
            break;
            
        case 'Enter':
        case ' ':
            if (currentScreen === 'quiz') {
                const nextBtn = document.getElementById('nextButton');
                const finishBtn = document.getElementById('finishButton');
                
                if (!nextBtn.classList.contains('hidden')) {
                    nextQuestion();
                } else if (!finishBtn.classList.contains('hidden')) {
                    finishQuiz();
                }
            }
            break;
            
        case 'r':
        case 'R':
            if (currentScreen === 'results') {
                restartQuiz();
            }
            break;
    }
}

// Gerenciar redimensionamento
function handleResize() {
    // Ajustar layout para dispositivos móveis
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
}

// Gerenciar visibilidade da página
function handleVisibilityChange() {
    if (document.hidden && cs2Quiz.gameActive) {
        // Pausar timer quando página não está visível
        cs2Quiz.clearTimer();
    } else if (!document.hidden && cs2Quiz.gameActive && !cs2Quiz.isAnswered) {
        // Retomar timer quando página volta a ser visível
        cs2Quiz.startTimer();
    }
}

// Configurar modal de configurações
function setupSettingsModal() {
    settingsModal = document.getElementById('settingsModal');
    
    // Carregar configurações nos controles
    const settings = quizStorage.getSettings();
    document.getElementById('volumeSlider').value = settings.volume;
    document.getElementById('soundEffects').checked = settings.soundEffects;
    document.getElementById('animations').checked = settings.animations;
}

// Configurar input do nome do jogador
function setupPlayerNameInput() {
    const playerNameInput = document.getElementById('playerName');
    
    // Salvar nome automaticamente
    playerNameInput.addEventListener('input', function() {
        const name = this.value.trim();
        if (name) {
            quizStorage.savePlayerName(name);
        }
    });
    
    // Enter para iniciar quiz rápido
    playerNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            startQuiz('medio'); // Modo padrão
        }
    });
}

// Carregar configurações
function loadSettings() {
    const settings = quizStorage.getSettings();
    
    // Aplicar configurações de animação
    if (!settings.animations) {
        document.body.classList.add('no-animations');
    }
    
    // Configurar volume
    if (cs2Quiz.audioContext) {
        cs2Quiz.audioContext.volume = settings.volume / 100;
    }
}



// Mostrar estatísticas do banco de perguntas
function displayQuestionStats() {
    const stats = getQuestionsStats();
    console.log('📊 Estatísticas do banco de perguntas:', stats);
    
    // Adicionar informações na tela de boas-vindas
    const welcomeScreen = document.getElementById('welcomeScreen');
    const statsDiv = document.createElement('div');
    statsDiv.className = 'question-stats';
    statsDiv.style.cssText = `
        text-align: center;
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 0.5rem;
        font-size: 0.9rem;
        color: var(--cs2-gray);
    `;
    
    statsDiv.innerHTML = `
        <p>📚 <strong>${stats.total}</strong> perguntas disponíveis</p>
        <p>🏷️ <strong>${stats.categories.length}</strong> categorias: ${stats.categories.join(', ')}</p>
    `;
    
    welcomeScreen.appendChild(statsDiv);
}

// Verificar dados salvos
function checkSavedData() {
    const stats = quizStorage.getPlayerStats();
    
    if (stats.totalGames > 0) {
        // Mostrar mensagem de boas-vindas para jogadores recorrentes
        const welcomeMessage = document.createElement('div');
        welcomeMessage.style.cssText = `
            text-align: center;
            margin: 1rem 0;
            padding: 1rem;
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid var(--cs2-orange);
            border-radius: 0.5rem;
        `;
        
        welcomeMessage.innerHTML = `
            <p>👋 Bem-vindo de volta, <strong>${stats.name || 'Jogador'}</strong>!</p>
            <p>🎯 Melhor pontuação: <strong>${stats.bestScore}</strong> | 
               📊 Precisão geral: <strong>${stats.overallAccuracy}%</strong></p>
        `;
        
        const welcomeScreen = document.getElementById('welcomeScreen');
        const title = welcomeScreen.querySelector('.welcome-title');
        title.parentNode.insertBefore(welcomeMessage, title.nextSibling);
    }
}

// ===== FUNÇÕES GLOBAIS PARA OS BOTÕES =====

// Iniciar quiz
function startQuiz(difficulty) {
    currentScreen = 'quiz';
    cs2Quiz.startQuiz(difficulty);
}

// Mostrar tela de boas-vindas
function showWelcomeScreen() {
    currentScreen = 'welcome';
    cs2Quiz.showScreen('welcome');
}

// Mostrar ranking
function showRanking() {
    currentScreen = 'ranking';
    cs2Quiz.showScreen('ranking');
}

// Mostrar estatísticas
function showStatistics() {
    currentScreen = 'statistics';
    cs2Quiz.showScreen('statistics');
}

// Próxima pergunta
function nextQuestion() {
    cs2Quiz.nextQuestion();
}

// Finalizar quiz
function finishQuiz() {
    cs2Quiz.finishQuiz();
    currentScreen = 'results';
}

// Reiniciar quiz
function restartQuiz() {
    cs2Quiz.restartQuiz();
    currentScreen = 'quiz';
}

// Compartilhar resultados
function shareResults() {
    cs2Quiz.shareResults();
}

// Resetar estatísticas
function resetStatistics() {
    if (confirm('Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.')) {
        quizStorage.resetAllData();
        alert('Estatísticas resetadas com sucesso!');
        showWelcomeScreen();
    }
}

// Abrir configurações
function openSettings() {
    settingsModal.classList.remove('hidden');
}

// Fechar configurações
function closeSettings() {
    // Salvar configurações
    const settings = {
        volume: parseInt(document.getElementById('volumeSlider').value),
        soundEffects: document.getElementById('soundEffects').checked,
        animations: document.getElementById('animations').checked
    };
    
    quizStorage.saveSettings(settings);
    cs2Quiz.settings = settings;
    
    // Aplicar configurações
    loadSettings();
    
    settingsModal.classList.add('hidden');
    
    // Feedback
    cs2Quiz.playSound('correct');
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Formatar tempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Copiar para clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado para a área de transferência!');
        });
    } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copiado para a área de transferência!');
    }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--cs2-orange);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Detectar dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Vibrar dispositivo (se suportado)
function vibrate(pattern = [100]) {
    if (navigator.vibrate && isMobileDevice()) {
        navigator.vibrate(pattern);
    }
}

// ===== FUNÇÕES DE EXPORTAÇÃO/IMPORTAÇÃO =====

// Exportar dados
function exportData() {
    quizStorage.exportData();
    showNotification('Dados exportados com sucesso!');
}

// Importar dados
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            quizStorage.importData(file)
                .then(() => {
                    showNotification('Dados importados com sucesso!');
                    showWelcomeScreen();
                })
                .catch(error => {
                    showNotification('Erro ao importar dados: ' + error.message, 'error');
                });
        }
    };
    
    input.click();
}

// ===== EASTER EGGS E RECURSOS ESPECIAIS =====

// Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(event) {
    konamiCode.push(event.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

// Ativar easter egg
function activateEasterEgg() {
    showNotification('🎉 Easter Egg ativado! Modo desenvolvedor habilitado!');
    
    // Adicionar funcionalidades especiais
    window.devMode = true;
    window.quiz = cs2Quiz;
    window.storage = quizStorage;
    window.questions = questionsDatabase;
    
    console.log('🎮 Modo desenvolvedor ativado!');
    console.log('Comandos disponíveis:');
    console.log('- window.quiz: Acesso ao objeto do quiz');
    console.log('- window.storage: Acesso ao sistema de armazenamento');
    console.log('- window.questions: Acesso ao banco de perguntas');
}

// ===== ANALYTICS E TELEMETRIA (OPCIONAL) =====

// Rastrear eventos (sem dados pessoais)
function trackEvent(eventName, properties = {}) {
    if (window.devMode) {
        console.log('📊 Evento:', eventName, properties);
    }
    
    // Aqui você pode integrar com serviços de analytics
    // como Google Analytics, Mixpanel, etc.
}

// Rastrear início de quiz
function trackQuizStart(difficulty) {
    trackEvent('quiz_started', { difficulty });
}

// Rastrear finalização de quiz
function trackQuizComplete(results) {
    trackEvent('quiz_completed', {
        difficulty: results.difficulty,
        score: results.score,
        accuracy: results.accuracy,
        duration: results.averageTime
    });
}

// ===== INICIALIZAÇÃO FINAL =====

// Verificar compatibilidade do navegador
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        audioContext: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined',
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid')
    };
    
    const unsupported = Object.entries(features)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (unsupported.length > 0) {
        console.warn('⚠️ Recursos não suportados:', unsupported);
        showNotification('Alguns recursos podem não funcionar corretamente neste navegador.', 'warning');
    }
}

// Executar verificação de compatibilidade
checkBrowserCompatibility();

// Log de inicialização
console.log('🎯 Quiz CS2 v1.0 - Desenvolvido com ❤️');
console.log('📱 Dispositivo móvel:', isMobileDevice());
console.log('🌐 User Agent:', navigator.userAgent);

// Exportar funções globais
window.startQuiz = startQuiz;
window.showWelcomeScreen = showWelcomeScreen;
window.showRanking = showRanking;
window.showStatistics = showStatistics;
window.nextQuestion = nextQuestion;
window.finishQuiz = finishQuiz;
window.restartQuiz = restartQuiz;
window.shareResults = shareResults;
window.resetStatistics = resetStatistics;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.exportData = exportData;
window.importData = importData;
