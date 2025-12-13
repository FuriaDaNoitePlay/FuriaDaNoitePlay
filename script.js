// script.js - Página de Manutenção FuriaDaNoitePlay
document.addEventListener('DOMContentLoaded', function() {
    // Configurações atualizadas
    const RETURN_DATE = new Date('February 1, 2026 00:00:00 GMT-0300');
    const START_DATE = new Date('August 1, 2025 00:00:00 GMT-0300');
    const CURRENT_DATE = new Date();
    
    // Elementos atualizados
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const gameButton = document.getElementById('gameButton');
    const thankYouMessage = document.querySelector('.thank-you-message');
    const statusDot = document.querySelector('.status-dot');
    const positiveTag = document.querySelector('.positive-tag');
    const maintenanceHeader = document.querySelector('.maintenance-header');
    const countdownElements = document.querySelectorAll('.time-block span');
    
    // Variáveis de controle
    let isGameButtonClicked = false;
    let typingInterval;
    let animationInterval;
    
    // Inicialização completa
    function init() {
        setupEventListeners();
        updateAll();
        setInterval(updateCountdown, 1000);
        initStatusIndicator();
        initPositiveTagAnimation();
        initCountdownAnimation();
        initHeaderEffects();
        initProgressAnimation();
        
        // Iniciar animações após carregamento
        setTimeout(() => {
            initTypingEffect();
            initEntranceAnimations();
        }, 500);
    }
    
    // Configurar todos os event listeners
    function setupEventListeners() {
        // Botão do Jogo da Velha
        if (gameButton) {
            gameButton.addEventListener('click', handleGameButtonClick);
            gameButton.addEventListener('mouseenter', () => {
                if (!isGameButtonClicked) {
                    gameButton.style.transform = 'translateY(-5px)';
                    gameButton.style.boxShadow = '0 10px 25px rgba(0, 123, 255, 0.4)';
                }
            });
            
            gameButton.addEventListener('mouseleave', () => {
                if (!isGameButtonClicked) {
                    gameButton.style.transform = '';
                    gameButton.style.boxShadow = '';
                }
            });
        }
        
        // Efeitos nos blocos de tempo
        countdownElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.1)';
                element.style.color = '#ff4757';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            });
        });
        
        // Atualizar ao redimensionar a janela
        window.addEventListener('resize', updateProgressBar);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Espaço para jogo
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (gameButton) gameButton.click();
            }
            
            // Enter para refresh
            if (e.ctrlKey && e.code === 'Enter') {
                location.reload();
            }
        });
    }
    
    // Atualizar todos os elementos
    function updateAll() {
        updateCountdown();
        updateProgressBar();
        updateDateTimeDisplay();
    }
    
    // Atualizar contagem regressiva
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = RETURN_DATE - now;
        
        if (timeRemaining <= 0) {
            handleCountdownComplete();
            return;
        }
        
        updateTimeElements(timeRemaining);
        updateDynamicProgress(timeRemaining);
        updateCountdownColors(timeRemaining);
    }
    
    // Atualizar elementos de tempo
    function updateTimeElements(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Adicionar animação nas mudanças
        animateNumberChange(daysEl, days);
        animateNumberChange(hoursEl, hours);
        animateNumberChange(minutesEl, minutes);
        animateNumberChange(secondsEl, seconds);
    }
    
    // Animação para mudança de números
    function animateNumberChange(element, newValue) {
        const oldValue = parseInt(element.textContent) || 0;
        
        if (oldValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#ff6b81';
            
            setTimeout(() => {
                element.textContent = padZero(newValue);
                element.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    element.style.color = '';
                }, 300);
            }, 150);
        } else {
            element.textContent = padZero(newValue);
        }
    }
    
    // Atualizar barra de progresso dinamicamente
    function updateProgressBar() {
        const now = new Date();
        const totalTime = RETURN_DATE - START_DATE;
        const timePassed = now - START_DATE;
        let percentage = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
        percentage = Math.round(percentage * 10) / 10; // Uma casa decimal
        
        if (progressFill && progressPercentage) {
            progressFill.style.width = `${percentage}%`;
            progressPercentage.textContent = `${percentage.toFixed(1)}%`;
            
            updateProgressColor(percentage);
            updateProgressGlow(percentage);
        }
    }
    
    // Progresso dinâmico baseado no tempo restante
    function updateDynamicProgress(timeRemaining) {
        const totalTime = RETURN_DATE - START_DATE;
        const timePassed = totalTime - timeRemaining;
        const percentage = (timePassed / totalTime) * 100;
        
        // Atualizar velocidade baseada na porcentagem
        const speed = Math.max(0.1, 1 - (percentage / 100));
        document.documentElement.style.setProperty('--progress-speed', `${speed}s`);
    }
    
    // Atualizar cores da barra de progresso
    function updateProgressColor(percentage) {
        const hue = Math.floor((percentage / 100) * 120); // 0-120 (vermelho-verde)
        const color = `hsl(${hue}, 80%, 50%)`;
        
        if (progressFill) {
            progressFill.style.background = `
                linear-gradient(90deg, 
                    ${color} 0%, 
                    hsl(${hue}, 90%, 60%) 50%, 
                    ${color} 100%
                )`;
        }
    }
    
    // Adicionar brilho à barra de progresso
    function updateProgressGlow(percentage) {
        if (percentage >= 70) {
            progressFill.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
        } else if (percentage >= 40) {
            progressFill.style.boxShadow = '0 0 10px rgba(255, 165, 0, 0.3)';
        } else {
            progressFill.style.boxShadow = '0 0 5px rgba(255, 71, 87, 0.3)';
        }
    }
    
    // Atualizar cores da contagem regressiva
    function updateCountdownColors(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        
        countdownElements.forEach((element, index) => {
            if (days < 7) {
                // Menos de 1 semana: vermelho
                element.style.color = '#ff4757';
                element.style.textShadow = '0 0 10px rgba(255, 71, 87, 0.5)';
            } else if (days < 30) {
                // Menos de 1 mês: laranja
                element.style.color = '#ffa502';
                element.style.textShadow = '0 0 8px rgba(255, 165, 2, 0.4)';
            } else {
                // Normal: branco
                element.style.color = '#ffffff';
                element.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
            }
        });
    }
    
    // Efeito de digitação
    function initTypingEffect() {
        if (!thankYouMessage) return;
        
        const originalText = thankYouMessage.textContent;
        thankYouMessage.textContent = '';
        thankYouMessage.style.opacity = '0';
        
        let i = 0;
        const typingSpeed = 50;
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        thankYouMessage.appendChild(cursor);
        
        function type() {
            if (i < originalText.length) {
                const char = originalText.charAt(i);
                thankYouMessage.insertBefore(document.createTextNode(char), cursor);
                i++;
                
                // Efeito sonoro opcional (simulado)
                if (i % 3 === 0) {
                    thankYouMessage.style.transform = 'translateY(-1px)';
                    setTimeout(() => {
                        thankYouMessage.style.transform = '';
                    }, 50);
                }
                
                typingInterval = setTimeout(type, typingSpeed);
            } else {
                cursor.remove();
                thankYouMessage.style.opacity = '1';
                thankYouMessage.style.transform = 'translateY(0)';
            }
        }
        
        // Adicionar estilo de cursor piscando
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(type, 1500);
    }
    
    // Manipular clique no botão do jogo
    function handleGameButtonClick() {
        if (isGameButtonClicked) return;
        
        isGameButtonClicked = true;
        
        // Efeito visual
        gameButton.style.transform = 'scale(0.9)';
        gameButton.style.opacity = '0.7';
        gameButton.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
        gameButton.style.boxShadow = '0 0 30px rgba(0, 176, 155, 0.5)';
        
        // Efeito de partículas (simulado)
        createButtonParticles();
        
        // Feedback sonoro (simulado)
        gameButton.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            gameButton.style.transform = '';
            gameButton.style.opacity = '';
            gameButton.style.animation = '';
            
            // Redirecionar após animação
            setTimeout(() => {
                window.location.href = 'velha.html';
            }, 300);
        }, 300);
    }
    
    // Criar partículas para o botão
    function createButtonParticles() {
        const buttonRect = gameButton.getBoundingClientRect();
        const particles = 10;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 5px;
                height: 5px;
                background: ${i % 2 === 0 ? '#00b09b' : '#96c93d'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${buttonRect.left + buttonRect.width / 2}px;
                top: ${buttonRect.top + buttonRect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            
            // Animação da partícula
            const angle = (Math.PI * 2 * i) / particles;
            const speed = 2 + Math.random();
            const duration = 500 + Math.random() * 500;
            
            particle.animate([
                {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * 50}px, ${Math.sin(angle) * 50}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.2, 0, 0.8, 1)'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Animações de entrada
    function initEntranceAnimations() {
        const elements = document.querySelectorAll('.maintenance-content > *:not(.positive-tag)');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) rotateX(10deg)';
            element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) rotateX(0)';
            }, 100 + (index * 150));
        });
        
        // Animação especial para a tag POSITIVO
        if (positiveTag) {
            positiveTag.style.opacity = '0';
            positiveTag.style.transform = 'scale(0) rotate(180deg)';
            positiveTag.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                positiveTag.style.opacity = '1';
                positiveTag.style.transform = 'scale(1) rotate(0deg)';
            }, 1000);
        }
    }
    
    // Indicador de status pulsante
    function initStatusIndicator() {
        if (statusDot) {
            setInterval(() => {
                statusDot.style.boxShadow = '0 0 10px 5px rgba(255, 71, 87, 0.5)';
                setTimeout(() => {
                    statusDot.style.boxShadow = '';
                }, 500);
            }, 2000);
        }
    }
    
    // Animação da tag POSITIVO
    function initPositiveTagAnimation() {
        if (!positiveTag) return;
        
        animationInterval = setInterval(() => {
            positiveTag.style.transform = 'scale(1.05)';
            positiveTag.style.boxShadow = '0 0 20px rgba(0, 176, 155, 0.5)';
            
            setTimeout(() => {
                positiveTag.style.transform = 'scale(1)';
                positiveTag.style.boxShadow = '';
            }, 300);
        }, 5000);
    }
    
    // Animação do contador
    function initCountdownAnimation() {
        countdownElements.forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
    }
    
    // Efeitos no cabeçalho
    function initHeaderEffects() {
        if (maintenanceHeader) {
            maintenanceHeader.style.transition = 'all 0.5s ease';
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                if (scrolled > 50) {
                    maintenanceHeader.style.transform = 'translateY(-10px)';
                    maintenanceHeader.style.opacity = '0.9';
                } else {
                    maintenanceHeader.style.transform = '';
                    maintenanceHeader.style.opacity = '1';
                }
            });
        }
    }
    
    // Animação inicial da barra de progresso
    function initProgressAnimation() {
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 1000);
        }
    }
    
    // Atualizar display de data/hora
    function updateDateTimeDisplay() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        
        // Adicionar data/hora atual se houver elemento
        const dateTimeElement = document.getElementById('currentDateTime');
        if (!dateTimeElement) {
            const newElement = document.createElement('div');
            newElement.id = 'currentDateTime';
            newElement.style.cssText = `
                text-align: center;
                color: #888;
                font-size: 0.9rem;
                margin-top: 10px;
                opacity: 0.7;
            `;
            document.querySelector('.countdown-container').appendChild(newElement);
        }
        
        const dateTimeDisplay = document.getElementById('currentDateTime');
        if (dateTimeDisplay) {
            dateTimeDisplay.textContent = 
                `Atualizado: ${now.toLocaleDateString('pt-BR', dateOptions)} ` +
                `às ${now.toLocaleTimeString('pt-BR', timeOptions)}`;
        }
    }
    
    // Manipular conclusão da contagem regressiva
    function handleCountdownComplete() {
        // Parar todas as animações
        clearInterval(typingInterval);
        clearInterval(animationInterval);
        
        // Atualizar para "PRONTO"
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        // Efeito especial
        document.querySelectorAll('.time-block').forEach(block => {
            block.style.animation = 'celebrate 1s ease infinite';
        });
        
        // Atualizar progresso para 100%
        if (progressFill && progressPercentage) {
            progressFill.style.width = '100%';
            progressPercentage.textContent = '100%';
            progressFill.style.background = 'linear-gradient(90deg, #00b09b, #96c93d)';
            progressFill.style.boxShadow = '0 0 20px rgba(0, 176, 155, 0.5)';
        }
        
        // Atualizar status
        if (statusDot) {
            statusDot.style.background = '#00b09b';
            statusDot.style.boxShadow = '0 0 15px #00b09b';
        }
        
        // Adicionar animação de celebração
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrate {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Funções auxiliares
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    // Cleanup function
    function cleanup() {
        clearInterval(typingInterval);
        clearInterval(animationInterval);
        
        // Remover event listeners
        if (gameButton) {
            gameButton.removeEventListener('click', handleGameButtonClick);
        }
        
        window.removeEventListener('resize', updateProgressBar);
    }
    
    // Inicializar quando a página estiver completamente carregada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup quando a página for descarregada
    window.addEventListener('beforeunload', cleanup);
    
    // Adicionar estilos CSS dinâmicos
    const dynamicStyles = `
        .time-block {
            transition: all 0.3s ease;
        }
        
        .time-block:hover {
            transform: translateY(-5px);
        }
        
        .progress-bar {
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});

// Verificar suporte a Web Animations API
if (!('animate' in document.documentElement)) {
    console.warn('Web Animations API não suportada neste navegador');
                          }
