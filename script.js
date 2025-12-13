// script.js - Página de Manutenção FuriaDaNoitePlay
document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const RETURN_DATE = new Date('February 1, 2026 00:00:00 GMT-0300');
    const START_DATE = new Date('August 1, 2025 00:00:00 GMT-0300');
    
    // Elementos
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const gameButton = document.getElementById('gameButton');
    const thankYouMessage = document.querySelector('.thank-you-message');
    
    // Inicialização
    init();

    // Funções Principais
    function init() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
        initTypingEffect();
        initButtonEffects();
        initEntranceAnimations();
    }
    
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = RETURN_DATE - now;
        
        if (timeRemaining <= 0) {
            resetCountdown();
            return;
        }
        
        updateTimeElements(timeRemaining);
        updateProgressBar(timeRemaining);
    }
    
    function updateTimeElements(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        daysEl.textContent = padZero(days);
        hoursEl.textContent = padZero(hours);
        minutesEl.textContent = padZero(minutes);
        secondsEl.textContent = padZero(seconds);
    }
    
    function updateProgressBar(timeRemaining) {
        const totalTime = RETURN_DATE - START_DATE;
        const timePassed = totalTime - timeRemaining;
        let percentage = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
        percentage = Math.round(percentage);
        
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
        
        updateProgressColor(percentage);
    }
    
    function updateProgressColor(percentage) {
        const colors = {
            low: 'linear-gradient(90deg, #ff4757, #ff6b81)',
            medium: 'linear-gradient(90deg, #ffa502, #ffbe76)',
            high: 'linear-gradient(90deg, #00b09b, #96c93d)'
        };
        
        progressFill.style.background = percentage < 30 ? colors.low : 
                                      percentage < 70 ? colors.medium : colors.high;
    }
    
    function initTypingEffect() {
        const originalText = thankYouMessage.textContent;
        thankYouMessage.textContent = '';
        
        let i = 0;
        const typingSpeed = 80;
        
        function type() {
            if (i < originalText.length) {
                thankYouMessage.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
            }
        }
        
        setTimeout(type, 1000);
    }
    
    function initButtonEffects() {
        gameButton.addEventListener('click', function() {
            gameButton.style.transform = 'scale(0.95)';
            gameButton.style.opacity = '0.8';
            
            setTimeout(() => {
                gameButton.style.transform = '';
                gameButton.style.opacity = '';
                
                setTimeout(() => {
                    window.location.href = 'velha.html';
                }, 200);
            }, 200);
        });
    }
    
    function initEntranceAnimations() {
        const elements = document.querySelectorAll('.maintenance-content > *');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }
    
    // Funções Auxiliares
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    function resetCountdown() {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
    }
});
