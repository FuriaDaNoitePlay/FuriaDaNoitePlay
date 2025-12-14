// script.js - Página de Manutenção FuriaDaNoitePlay com Chat Discord
document.addEventListener('DOMContentLoaded', function() {
    // ================= CONFIGURAÇÕES GLOBAIS =================
    const CONFIG = {
        RETURN_DATE: new Date('February 1, 2026 00:00:00 GMT-0300'),
        START_DATE: new Date('August 1, 2025 00:00:00 GMT-0300'),
        CURRENT_DATE: new Date(),
        DISCORD_CHANNELS: ['1330988731376861257', '1328458975615651882'],
        WS_SERVER_URL: 'wss://SEU-REPLIT-AQUI.replit.app', // ⚠️ ALTERE AQUI!
        RECONNECT_DELAY: 5000,
        MAX_RECONNECT_ATTEMPTS: 10
    };
    
    // ================= ELEMENTOS DOM =================
    const elements = {
        // Contador
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        
        // Progresso
        progressFill: document.getElementById('progressFill'),
        progressPercentage: document.getElementById('progressPercentage'),
        
        // Chat Discord
        messagesContainer: document.getElementById('messagesContainer'),
        nickInput: document.getElementById('nickInput'),
        messageInput: document.getElementById('messageInput'),
        sendButton: document.getElementById('sendButton'),
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        connectionStatus: document.getElementById('connectionStatus'),
        welcomeTime: document.getElementById('welcomeTime'),
        
        // Interface
        gameButton: document.getElementById('gameButton'),
        thankYouMessage: document.querySelector('.thank-you-message'),
        statusDot: document.querySelector('.status-dot'),
        positiveTag: document.querySelector('.positive-tag'),
        maintenanceHeader: document.querySelector('.maintenance-header'),
        timeBlocks: document.querySelectorAll('.time-block span'),
        chatSection: document.querySelector('.chat-section')
    };
    
    // ================= VARIÁVEIS DE ESTADO =================
    const state = {
        isGameButtonClicked: false,
        typingInterval: null,
        animationInterval: null,
        socket: null,
        isConnected: false,
        userNick: '',
        reconnectAttempts: 0,
        chatMessages: [],
        isTyping: false,
        discordUsers: new Set()
    };
    
    // ================= INICIALIZAÇÃO PRINCIPAL =================
    function init() {
        setupEventListeners();
        updateAll();
        initStatusIndicator();
        initPositiveTagAnimation();
        initCountdownAnimation();
        initHeaderEffects();
        initProgressAnimation();
        initChatSystem();
        
        // Iniciar temporizadores
        setInterval(updateCountdown, 1000);
        
        // Animações de entrada
        setTimeout(() => {
            initTypingEffect();
            initEntranceAnimations();
        }, 500);
    }
    
    // ================= SISTEMA DE CHAT DISCORD =================
    function initChatSystem() {
        if (!elements.messagesContainer) return;
        
        // Configurar hora de boas-vindas
        elements.welcomeTime.textContent = getCurrentTime();
        
        // Carregar nick salvo
        loadSavedNick();
        
        // Conectar ao servidor WebSocket
        connectToDiscordServer();
        
        // Adicionar mensagem inicial
        setTimeout(() => {
            addSystemMessage('💡 Digite seu nick e comece a conversar no chat Discord!');
        }, 2000);
    }
    
    function connectToDiscordServer() {
        updateConnectionStatus('Conectando ao Discord...', false);
        
        try {
            state.socket = new WebSocket(CONFIG.WS_SERVER_URL);
            
            state.socket.onopen = function() {
                console.log('✅ Conectado ao servidor Discord');
                updateConnectionStatus('Conectado ao Discord ✓', true);
                state.isConnected = true;
                state.reconnectAttempts = 0;
                
                // Enviar inscrição nos canais
                state.socket.send(JSON.stringify({
                    type: 'subscribe',
                    channels: CONFIG.DISCORD_CHANNELS
                }));
                
                addSystemMessage('✅ Chat conectado ao Discord!');
            };
            
            state.socket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    handleDiscordMessage(data);
                } catch (error) {
                    console.error('Erro ao processar mensagem:', error);
                }
            };
            
            state.socket.onerror = function(error) {
                console.error('❌ Erro na conexão Discord:', error);
                updateConnectionStatus('Erro na conexão', false);
                state.isConnected = false;
            };
            
            state.socket.onclose = function() {
                console.log('🔌 Conexão Discord fechada');
                updateConnectionStatus('Desconectado do Discord', false);
                state.isConnected = false;
                
                // Tentar reconectar
                attemptReconnect();
            };
            
        } catch (error) {
            console.error('❌ Erro ao conectar ao Discord:', error);
            updateConnectionStatus('Falha na conexão', false);
            addSystemMessage('⚠️ Modo demonstração do chat ativado');
            simulateDiscordDemo();
        }
    }
    
    function handleDiscordMessage(data) {
        switch(data.type) {
            case 'discord_message':
                addDiscordMessage(data.author, data.content, data.timestamp);
                break;
                
            case 'connected':
                addSystemMessage(data.message || 'Conectado ao chat Discord!');
                break;
                
            case 'message_sent':
                if (data.success) {
                    showNotification('✅ Mensagem enviada para o Discord!', 'success');
                } else {
                    showNotification('❌ Erro ao enviar: ' + (data.error || 'Desconhecido'), 'error');
                }
                break;
                
            case 'user_joined':
                addSystemMessage(`👋 ${data.nick} entrou no chat`);
                state.discordUsers.add(data.nick);
                break;
                
            case 'user_left':
                addSystemMessage(`👋 ${data.nick} saiu do chat`);
                state.discordUsers.delete(data.nick);
                break;
        }
    }
    
    function sendChatMessage() {
        const nick = elements.nickInput.value.trim();
        const message = elements.messageInput.value.trim();
        
        // Validações
        if (!nick || nick.length < 2) {
            showNotification('⚠️ Digite um nick com pelo menos 2 caracteres!', 'warning');
            elements.nickInput.focus();
            return;
        }
        
        if (!message) {
            showNotification('⚠️ Digite uma mensagem!', 'warning');
            elements.messageInput.focus();
            return;
        }
        
        if (message.length > 500) {
            showNotification('⚠️ Mensagem muito longa! Máximo 500 caracteres.', 'warning');
            return;
        }
        
        // Salvar nick
        saveNick(nick);
        
        // Adicionar mensagem localmente
        const timestamp = getCurrentTime();
        addUserMessage(nick, message, timestamp);
        
        // Enviar para o servidor
        if (state.isConnected && state.socket && state.socket.readyState === WebSocket.OPEN) {
            try {
                state.socket.send(JSON.stringify({
                    type: 'send_message',
                    nick: nick,
                    message: message,
                    timestamp: timestamp,
                    channel_id: CONFIG.DISCORD_CHANNELS[0]
                }));
            } catch (error) {
                console.error('❌ Erro ao enviar para Discord:', error);
                showNotification('❌ Erro ao enviar mensagem', 'error');
            }
        } else {
            showNotification('⚠️ Modo demonstração - Mensagem não enviada ao Discord', 'warning');
        }
        
        // Limpar e focar
        elements.messageInput.value = '';
        updateSendButtonState();
        elements.messageInput.focus();
    }
    
    function addUserMessage(nick, message, timestamp) {
        if (elements.messagesContainer.children.length === 1 && 
            elements.messagesContainer.firstChild.classList.contains('system-message')) {
            elements.messagesContainer.innerHTML = '';
        }
        
        const messageElement = createMessageElement(nick, message, timestamp, 'user');
        elements.messagesContainer.appendChild(messageElement);
        scrollToBottom();
        state.chatMessages.push({ nick, message, timestamp, type: 'user' });
    }
    
    function addDiscordMessage(author, content, timestamp) {
        const messageElement = createMessageElement(author, content, timestamp, 'discord');
        elements.messagesContainer.appendChild(messageElement);
        scrollToBottom();
        state.chatMessages.push({ nick: author, message: content, timestamp, type: 'discord' });
    }
    
    function addSystemMessage(message) {
        const timestamp = getCurrentTime();
        const messageElement = createMessageElement('Sistema', message, timestamp, 'system');
        elements.messagesContainer.appendChild(messageElement);
        scrollToBottom();
        state.chatMessages.push({ nick: 'Sistema', message, timestamp, type: 'system' });
    }
    
    function createMessageElement(nick, message, timestamp, type = 'user') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type === 'discord' ? 'discord-message' : ''} ${type === 'system' ? 'system-message' : ''}`;
        
        const time = timestamp || getCurrentTime();
        const discordIcon = type === 'discord' ? '<i class="fab fa-discord"></i> ' : '';
        const systemIcon = type === 'system' ? '<i class="fas fa-robot"></i> ' : '';
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-user">${systemIcon}${discordIcon}${nick}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${formatChatMessage(message)}</div>
        `;
        
        return messageElement;
    }
    
    function formatChatMessage(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => {
            const displayUrl = url.length > 40 ? url.substring(0, 37) + '...' : url;
            return `<a href="${url}" target="_blank" rel="noopener">${displayUrl}</a>`;
        });
    }
    
    function scrollToBottom() {
        if (elements.messagesContainer) {
            elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        }
    }
    
    function updateConnectionStatus(text, connected) {
        if (!elements.statusText || !elements.statusIndicator) return;
        
        elements.statusText.textContent = text;
        
        if (connected) {
            elements.statusIndicator.className = 'status-dot connected';
            elements.connectionStatus.style.background = 'rgba(68, 255, 68, 0.1)';
        } else {
            elements.statusIndicator.className = 'status-dot';
            elements.connectionStatus.style.background = 'rgba(255, 68, 68, 0.1)';
        }
    }
    
    function attemptReconnect() {
        if (state.reconnectAttempts < CONFIG.MAX_RECONNECT_ATTEMPTS) {
            state.reconnectAttempts++;
            const delay = Math.min(1000 * state.reconnectAttempts, 10000);
            
            addSystemMessage(`🔄 Reconectando em ${delay/1000}s... (${state.reconnectAttempts}/${CONFIG.MAX_RECONNECT_ATTEMPTS})`);
            
            setTimeout(() => {
                console.log(`🔄 Tentativa ${state.reconnectAttempts} de reconexão`);
                connectToDiscordServer();
            }, delay);
        } else {
            addSystemMessage('❌ Falha na conexão Discord. Recarregue a página.');
        }
    }
    
    function simulateDiscordDemo() {
        updateConnectionStatus('Modo Demonstração', true);
        
        const demoMessages = [
            { nick: 'DiscordBot', message: '✅ Chat em modo demonstração! Configure o servidor para conectar ao Discord real.', type: 'discord', delay: 1000 },
            { nick: 'Guerreiro88', message: 'Eae galera! Como vai a manutenção?', type: 'discord', delay: 3000 },
            { nick: 'NightWolf', message: 'Site em 73.6% já! Quase lá! 🔥', type: 'discord', delay: 5000 },
            { nick: 'FuriaFan', message: 'Visitem: https://furiadanoiteplay.com.br', type: 'discord', delay: 7000 }
        ];
        
        demoMessages.forEach(msg => {
            setTimeout(() => {
                if (msg.type === 'discord') {
                    addDiscordMessage(msg.nick, msg.message, getCurrentTime());
                }
            }, msg.delay);
        });
    }
    
    // ================= FUNÇÕES DO CHAT LOCAL =================
    function loadSavedNick() {
        if (!elements.nickInput) return;
        
        const savedNick = localStorage.getItem('furia_chat_nick');
        if (savedNick) {
            elements.nickInput.value = savedNick;
            state.userNick = savedNick;
            elements.messageInput.focus();
        } else {
            elements.nickInput.focus();
        }
        updateSendButtonState();
    }
    
    function saveNick(nick) {
        if (nick && nick !== state.userNick) {
            state.userNick = nick;
            localStorage.setItem('furia_chat_nick', nick);
            elements.nickInput.value = nick;
        }
    }
    
    function updateSendButtonState() {
        if (!elements.sendButton || !elements.nickInput || !elements.messageInput) return;
        
        const hasNick = elements.nickInput.value.trim().length >= 2;
        const hasMessage = elements.messageInput.value.trim().length > 0;
        elements.sendButton.disabled = !hasNick || !hasMessage;
    }
    
    // ================= FUNÇÕES DA PÁGINA DE MANUTENÇÃO =================
    function setupEventListeners() {
        // Botão do Jogo da Velha
        if (elements.gameButton) {
            elements.gameButton.addEventListener('click', handleGameButtonClick);
            elements.gameButton.addEventListener('mouseenter', handleGameButtonHover);
            elements.gameButton.addEventListener('mouseleave', handleGameButtonLeave);
        }
        
        // Sistema de Chat
        if (elements.sendButton) {
            elements.sendButton.addEventListener('click', sendChatMessage);
        }
        
        if (elements.messageInput) {
            elements.messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
            
            elements.messageInput.addEventListener('input', updateSendButtonState);
        }
        
        if (elements.nickInput) {
            elements.nickInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    saveNick(this.value.trim());
                }
            });
            
            elements.nickInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    elements.messageInput.focus();
                    if (this.value.trim()) {
                        saveNick(this.value.trim());
                    }
                }
            });
            
            elements.nickInput.addEventListener('input', updateSendButtonState);
        }
        
        // Efeitos nos blocos de tempo
        elements.timeBlocks.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.1)';
                element.style.color = '#ff4757';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            });
        });
        
        // Atualizar ao redimensionar
        window.addEventListener('resize', updateProgressBar);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Espaço para jogo
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (elements.gameButton) elements.gameButton.click();
            }
            
            // Foco no chat com Ctrl+C
            if (e.ctrlKey && e.code === 'KeyC') {
                e.preventDefault();
                if (elements.messageInput) {
                    elements.messageInput.focus();
                }
            }
        });
    }
    
    function updateAll() {
        updateCountdown();
        updateProgressBar();
        updateDateTimeDisplay();
    }
    
    function updateCountdown() {
        const now = new Date();
        const timeRemaining = CONFIG.RETURN_DATE - now;
        
        if (timeRemaining <= 0) {
            handleCountdownComplete();
            return;
        }
        
        updateTimeElements(timeRemaining);
        updateDynamicProgress(timeRemaining);
        updateCountdownColors(timeRemaining);
    }
    
    function updateTimeElements(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        animateNumberChange(elements.days, days);
        animateNumberChange(elements.hours, hours);
        animateNumberChange(elements.minutes, minutes);
        animateNumberChange(elements.seconds, seconds);
    }
    
    function animateNumberChange(element, newValue) {
        if (!element) return;
        
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
    
    function updateProgressBar() {
        const now = new Date();
        const totalTime = CONFIG.RETURN_DATE - CONFIG.START_DATE;
        const timePassed = now - CONFIG.START_DATE;
        let percentage = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
        percentage = Math.round(percentage * 10) / 10;
        
        if (elements.progressFill && elements.progressPercentage) {
            elements.progressFill.style.width = `${percentage}%`;
            elements.progressPercentage.textContent = `${percentage.toFixed(1)}%`;
            
            updateProgressColor(percentage);
            updateProgressGlow(percentage);
        }
    }
    
    function updateDynamicProgress(timeRemaining) {
        const totalTime = CONFIG.RETURN_DATE - CONFIG.START_DATE;
        const timePassed = totalTime - timeRemaining;
        const percentage = (timePassed / totalTime) * 100;
        
        const speed = Math.max(0.1, 1 - (percentage / 100));
        document.documentElement.style.setProperty('--progress-speed', `${speed}s`);
    }
    
    function updateProgressColor(percentage) {
        const hue = Math.floor((percentage / 100) * 120);
        const color = `hsl(${hue}, 80%, 50%)`;
        
        if (elements.progressFill) {
            elements.progressFill.style.background = `
                linear-gradient(90deg, 
                    ${color} 0%, 
                    hsl(${hue}, 90%, 60%) 50%, 
                    ${color} 100%
                )`;
        }
    }
    
    function updateProgressGlow(percentage) {
        if (!elements.progressFill) return;
        
        if (percentage >= 70) {
            elements.progressFill.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
        } else if (percentage >= 40) {
            elements.progressFill.style.boxShadow = '0 0 10px rgba(255, 165, 0, 0.3)';
        } else {
            elements.progressFill.style.boxShadow = '0 0 5px rgba(255, 71, 87, 0.3)';
        }
    }
    
    function updateCountdownColors(timeRemaining) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        
        elements.timeBlocks.forEach((element, index) => {
            if (days < 7) {
                element.style.color = '#ff4757';
                element.style.textShadow = '0 0 10px rgba(255, 71, 87, 0.5)';
            } else if (days < 30) {
                element.style.color = '#ffa502';
                element.style.textShadow = '0 0 8px rgba(255, 165, 2, 0.4)';
            } else {
                element.style.color = '#ffffff';
                element.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
            }
        });
    }
    
    function initTypingEffect() {
        if (!elements.thankYouMessage) return;
        
        const originalText = elements.thankYouMessage.textContent;
        elements.thankYouMessage.textContent = '';
        elements.thankYouMessage.style.opacity = '0';
        
        let i = 0;
        const typingSpeed = 50;
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        elements.thankYouMessage.appendChild(cursor);
        
        function type() {
            if (i < originalText.length) {
                const char = originalText.charAt(i);
                elements.thankYouMessage.insertBefore(document.createTextNode(char), cursor);
                i++;
                
                if (i % 3 === 0) {
                    elements.thankYouMessage.style.transform = 'translateY(-1px)';
                    setTimeout(() => {
                        elements.thankYouMessage.style.transform = '';
                    }, 50);
                }
                
                state.typingInterval = setTimeout(type, typingSpeed);
            } else {
                cursor.remove();
                elements.thankYouMessage.style.opacity = '1';
                elements.thankYouMessage.style.transform = 'translateY(0)';
            }
        }
        
        const style = document.createElement('style');
        style.textContent = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
        document.head.appendChild(style);
        
        setTimeout(type, 1500);
    }
    
    function handleGameButtonClick() {
        if (state.isGameButtonClicked) return;
        
        state.isGameButtonClicked = true;
        
        elements.gameButton.style.transform = 'scale(0.9)';
        elements.gameButton.style.opacity = '0.7';
        elements.gameButton.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
        elements.gameButton.style.boxShadow = '0 0 30px rgba(0, 176, 155, 0.5)';
        
        createButtonParticles();
        elements.gameButton.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            elements.gameButton.style.transform = '';
            elements.gameButton.style.opacity = '';
            elements.gameButton.style.animation = '';
            
            setTimeout(() => {
                window.location.href = 'velha.html';
            }, 300);
        }, 300);
    }
    
    function handleGameButtonHover() {
        if (!state.isGameButtonClicked) {
            elements.gameButton.style.transform = 'translateY(-5px)';
            elements.gameButton.style.boxShadow = '0 10px 25px rgba(0, 123, 255, 0.4)';
        }
    }
    
    function handleGameButtonLeave() {
        if (!state.isGameButtonClicked) {
            elements.gameButton.style.transform = '';
            elements.gameButton.style.boxShadow = '';
        }
    }
    
    function createButtonParticles() {
        if (!elements.gameButton) return;
        
        const buttonRect = elements.gameButton.getBoundingClientRect();
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
    
    function initEntranceAnimations() {
        const elementsList = document.querySelectorAll('.maintenance-content > *:not(.positive-tag)');
        
        elementsList.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) rotateX(10deg)';
            element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) rotateX(0)';
            }, 100 + (index * 150));
        });
        
        if (elements.positiveTag) {
            elements.positiveTag.style.opacity = '0';
            elements.positiveTag.style.transform = 'scale(0) rotate(180deg)';
            elements.positiveTag.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                elements.positiveTag.style.opacity = '1';
                elements.positiveTag.style.transform = 'scale(1) rotate(0deg)';
            }, 1000);
        }
    }
    
    function initStatusIndicator() {
        if (elements.statusDot) {
            setInterval(() => {
                elements.statusDot.style.boxShadow = '0 0 10px 5px rgba(255, 71, 87, 0.5)';
                setTimeout(() => {
                    elements.statusDot.style.boxShadow = '';
                }, 500);
            }, 2000);
        }
    }
    
    function initPositiveTagAnimation() {
        if (!elements.positiveTag) return;
        
        state.animationInterval = setInterval(() => {
            elements.positiveTag.style.transform = 'scale(1.05)';
            elements.positiveTag.style.boxShadow = '0 0 20px rgba(0, 176, 155, 0.5)';
            
            setTimeout(() => {
                elements.positiveTag.style.transform = 'scale(1)';
                elements.positiveTag.style.boxShadow = '';
            }, 300);
        }, 5000);
    }
    
    function initCountdownAnimation() {
        elements.timeBlocks.forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
    }
    
    function initHeaderEffects() {
        if (elements.maintenanceHeader) {
            elements.maintenanceHeader.style.transition = 'all 0.5s ease';
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                if (scrolled > 50) {
                    elements.maintenanceHeader.style.transform = 'translateY(-10px)';
                    elements.maintenanceHeader.style.opacity = '0.9';
                } else {
                    elements.maintenanceHeader.style.transform = '';
                    elements.maintenanceHeader.style.opacity = '1';
                }
            });
        }
    }
    
    function initProgressAnimation() {
        if (elements.progressFill) {
            setTimeout(() => {
                elements.progressFill.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 1000);
        }
    }
    
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
    
    function handleCountdownComplete() {
        clearInterval(state.typingInterval);
        clearInterval(state.animationInterval);
        
        if (elements.days) elements.days.textContent = '00';
        if (elements.hours) elements.hours.textContent = '00';
        if (elements.minutes) elements.minutes.textContent = '00';
        if (elements.seconds) elements.seconds.textContent = '00';
        
        document.querySelectorAll('.time-block').forEach(block => {
            block.style.animation = 'celebrate 1s ease infinite';
        });
        
        if (elements.progressFill && elements.progressPercentage) {
            elements.progressFill.style.width = '100%';
            elements.progressPercentage.textContent = '100%';
            elements.progressFill.style.background = 'linear-gradient(90deg, #00b09b, #96c93d)';
            elements.progressFill.style.boxShadow = '0 0 20px rgba(0, 176, 155, 0.5)';
        }
        
        if (elements.statusDot) {
            elements.statusDot.style.background = '#00b09b';
            elements.statusDot.style.boxShadow = '0 0 15px #00b09b';
        }
        
        const style = document.createElement('style');
        style.textContent = `@keyframes celebrate { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`;
        document.head.appendChild(style);
    }
    
    // ================= FUNÇÕES AUXILIARES =================
    function showNotification(text, type = 'info') {
        const colors = {
            success: 'linear-gradient(45deg, #00b09b, #96c93d)',
            error: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            warning: 'linear-gradient(45deg, #FF6B35, #FF8C42)',
            info: 'linear-gradient(45deg, #4A00E0, #8E2DE2)'
        };
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = text;
        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    function getCurrentTime() {
        return new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    function cleanup() {
        clearInterval(state.typingInterval);
        clearInterval(state.animationInterval);
        
        if (state.socket) {
            state.socket.close();
        }
        
        if (elements.gameButton) {
            elements.gameButton.removeEventListener('click', handleGameButtonClick);
        }
        
        window.removeEventListener('resize', updateProgressBar);
    }
    
    // ================= INICIALIZAÇÃO =================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.addEventListener('beforeunload', cleanup);
    
    // ================= ESTILOS DINÂMICOS =================
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
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            font-weight: 500;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
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
