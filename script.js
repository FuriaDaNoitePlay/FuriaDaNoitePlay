document.addEventListener('DOMContentLoaded', function() {
    // Data de retorno: 1 de fevereiro de 2026
    const returnDate = new Date('February 1, 2026 00:00:00 GMT-0300');
    
    // Elementos da contagem regressiva
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Elementos da barra de progresso
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    // Botão do jogo
    const gameButton = document.getElementById('gameButton');
    
    // Efeito de digitação para a mensagem de agradecimento
    const thankYouMessage = document.querySelector('.thank-you-message');
    const originalText = thankYouMessage.textContent;
    thankYouMessage.textContent = '';
    
    // Função para atualizar a contagem regressiva
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = returnDate - now;
        
        // Se a data já passou
        if (timeRemaining <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // Calcular dias, horas, minutos e segundos
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Atualizar os elementos HTML
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Atualizar a barra de progresso
        updateProgressBar(timeRemaining);
    }
    
    // Função para atualizar a barra de progresso
    function updateProgressBar(timeRemaining) {
        // Data de início: 1 de agosto de 2025
        const startDate = new Date('August 1, 2025 00:00:00 GMT-0300');
        const totalTime = returnDate - startDate;
        const timePassed = totalTime - timeRemaining;
        
        // Calcular a porcentagem (limitada entre 0 e 100)
        let percentage = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
        
        // Arredondar para evitar decimais muito longos
        percentage = Math.round(percentage);
        
        // Atualizar a barra de progresso
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
        
        // Mudar a cor da barra conforme o progresso
        if (percentage < 30) {
            progressFill.style.background = 'linear-gradient(90deg, #ff4757, #ff6b81)';
        } else if (percentage < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #ffa502, #ffbe76)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #00b09b, #96c93d)';
        }
    }
    
    // Efeito de digitação para a mensagem de agradecimento
    function typeWriterEffect() {
        let i = 0;
        const typingSpeed = 80; // milissegundos entre cada caractere
        
        function type() {
            if (i < originalText.length) {
                thankYouMessage.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
            }
        }
        
        type();
    }
    
    // Adicionar efeito de clique no botão do jogo
    gameButton.addEventListener('click', function() {
        // Efeito visual de clique
        gameButton.style.transform = 'scale(0.95)';
        gameButton.style.opacity = '0.8';
        
        setTimeout(() => {
            gameButton.style.transform = '';
            gameButton.style.opacity = '';
            
            // Redirecionar para o jogo da velha após um breve delay
            setTimeout(() => {
                window.location.href = 'velha.html';
            }, 200);
        }, 200);
    });
    
    // Iniciar a contagem regressiva
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Iniciar o efeito de digitação
    setTimeout(typeWriterEffect, 1000);
    
    // Adicionar efeito de entrada aos elementos
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
});
