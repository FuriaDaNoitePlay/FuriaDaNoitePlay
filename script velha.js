// ===== VARIÁVEIS GLOBAIS =====
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'ia'; // 'ia' ou '2players'
let difficulty = 'easy';
let scores = { X: 0, O: 0, tie: 0 };
let timerInterval = null;
let startTime = null;
let aiThinking = false;

// ===== ELEMENTOS DOM =====
const boardElement = document.getElementById('gameBoard');
const currentPlayerElement = document.getElementById('currentPlayer');
const messageTextElement = document.getElementById('messageText');
const messageSubElement = document.getElementById('messageSub');
const messagePlayerElement = document.getElementById('messagePlayer');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreTieElement = document.getElementById('scoreTie');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const newGameButton = document.getElementById('newGameButton');
const modeButton = document.getElementById('modeButton');
const modeTextElement = document.getElementById('modeText');
const difficultyButtons = document.querySelectorAll('.diff-btn');
const messagePanel = document.getElementById('messagePanel');

// ===== SONS =====
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

// ===== INICIALIZAÇÃO =====
function init() {
    createBoard();
    updateDisplay();
    updateScores();
    startTimer();
    setupEventListeners();
    createParticles();
}

function createBoard() {
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        
        // Efeito de partículas ao passar o mouse
        cell.addEventListener('mouseenter', () => {
            if (!gameBoard[i] && gameActive && !aiThinking) {
                createHoverEffect(cell);
            }
        });
        
        cell.addEventListener('click', () => handleCellClick(i));
        
        boardElement.appendChild(cell);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
    modeButton.addEventListener('click', toggleGameMode);
    
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            difficulty = button.dataset.difficulty;
            showMessage(`Dificuldade alterada para: ${button.querySelector('.diff-text').textContent}`);
        });
    });
}

// ===== LÓGICA DO JOGO =====
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '' || aiThinking) return;
    
    // Tocar som
    playSound(clickSound);
    
    // Fazer jogada
    makeMove(index, currentPlayer);
    
    // Verificar vitória/empate
    checkGameStatus();
    
    // Se modo IA e jogo ainda ativo, IA joga
    if (gameMode === 'ia' && gameActive) {
        aiThinking = true;
        setTimeout(makeAIMove, getAIDelay());
    }
}

function makeMove(index, player) {
    gameBoard[index] = player;
    
    const cell = boardElement.children[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase(), 'occupied');
    
    // Efeito visual
    createRippleEffect(cell);
    createExplosionEffect(cell);
    
    // Atualizar display
    updateDisplay();
}

function checkGameStatus() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    
    let roundWon = false;
    let winner = '';
    
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            winner = gameBoard[a];
            
            // Animação da linha vencedora
            createVictoryLine(combination);
            
            // Efeito nas células vencedoras
            combination.forEach(index => {
                boardElement.children[index].classList.add('winner');
            });
            
            break;
        }
    }
    
    if (roundWon) {
        gameActive = false;
        scores[winner]++;
        updateScores();
        showVictoryMessage(winner);
        playSound(winSound);
        
        // Efeito de vitória
        createVictoryEffects();
        
    } else if (!gameBoard.includes('')) {
        gameActive = false;
        scores.tie++;
        updateScores();
        showMessage("🏁 EMPATE!", "Ninguém venceu esta batalha!");
        playSound(drawSound);
        boardElement.classList.add('shake');
    }
}

// ===== IA (INTELIGÊNCIA ARTIFICIAL) =====
function makeAIMove() {
    if (!gameActive) {
        aiThinking = false;
        return;
    }
    
    let move;
    
    switch(difficulty) {
        case 'easy':
            move = getEasyMove();
            break;
        case 'medium':
            move = getMediumMove();
            break;
        case 'hard':
            move = getHardMove();
            break;
    }
    
    if (move !== undefined) {
        setTimeout(() => {
            makeMove(move, 'O');
            checkGameStatus();
            aiThinking = false;
        }, 500);
    }
}

function getEasyMove() {
    // Movimento aleatório
    const available = gameBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : undefined;
}

function getMediumMove() {
    // Tenta vencer ou bloquear
    const aiPlayer = 'O';
    const humanPlayer = 'X';
    
    // 1. Tenta vencer
    let move = findWinningMove(aiPlayer);
    if (move !== undefined) return move;
    
    // 2. Tenta bloquear
    move = findWinningMove(humanPlayer);
    if (move !== undefined) return move;
    
    // 3. Meio se disponível
    if (gameBoard[4] === '') return 4;
    
    // 4. Movimento aleatório
    return getEasyMove();
}

function getHardMove() {
    // MiniMax algorithm
    return minimax(gameBoard, 'O').index;
}

function findWinningMove(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        const board = gameBoard;
        
        // Verifica se o jogador pode vencer nesta combinação
        const playerCount = (board[a] === player) + (board[b] === player) + (board[c] === player);
        const emptyCount = (board[a] === '') + (board[b] === '') + (board[c] === '');
        
        if (playerCount === 2 && emptyCount === 1) {
            if (board[a] === '') return a;
            if (board[b] === '') return b;
            if (board[c] === '') return c;
        }
    }
    
    return undefined;
}

function minimax(newBoard, player) {
    const available = newBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    
    // Verifica vitória/derrota/empate
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (available.length === 0) return { score: 0 };
    
    const moves = [];
    
    for (let i = 0; i < available.length; i++) {
        const move = {};
        move.index = available[i];
        
        newBoard[available[i]] = player;
        
        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }
        
        newBoard[available[i]] = '';
        moves.push(move);
    }
    
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}

function checkWin(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// ===== CONTROLES DO JOGO =====
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    aiThinking = false;
    
    // Limpar animações
    document.querySelectorAll('.victory-line').forEach(el => el.remove());
    boardElement.classList.remove('shake', 'board-victory');
    
    // Resetar células
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    // Resetar timer
    startTimer();
    
    updateDisplay();
    showMessage("🎮 NOVA PARTIDA!", "Jogador X começa!");
    
    // Criar efeito de partículas
    createResetEffect();
}

function newGame() {
    scores = { X: 0, O: 0, tie: 0 };
    updateScores();
    resetGame();
    showMessage("🔄 JOGO ZERADO!", "Todos os placares foram resetados!");
}

function toggleGameMode() {
    gameMode = gameMode === 'ia' ? '2players' : 'ia';
    modeTextElement.textContent = gameMode === 'ia' ? 'VS IA' : '2 JOGADORES';
    resetGame();
    
    const message = gameMode === 'ia' 
        ? "🤖 MODO IA ATIVADO!" 
        : "👥 MODO 2 JOGADORES!";
    showMessage(message);
}

// ===== DISPLAY E MENSAGENS =====
function updateDisplay() {
    currentPlayerElement.textContent = currentPlayer;
    messagePlayerElement.textContent = currentPlayer;
    
    if (gameActive) {
        if (gameMode === 'ia' && currentPlayer === 'O') {
            messageTextElement.innerHTML = `🤖 IA PENSANDO...`;
            messageSubElement.textContent = "Aguarde a jogada do computador";
        } else {
            messageTextElement.innerHTML = `Vez do jogador <span class="player-highlight">${currentPlayer}</span>`;
            messageSubElement.textContent = "Clique em uma célula para jogar";
        }
    }
    
    // Alternar jogador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateScores() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreTieElement.textContent = scores.tie;
    
    // Animação no placar
    scoreXElement.classList.add('score-update');
    scoreOElement.classList.add('score-update');
    scoreTieElement.classList.add('score-update');
    
    setTimeout(() => {
        scoreXElement.classList.remove('score-update');
        scoreOElement.classList.remove('score-update');
        scoreTieElement.classList.remove('score-update');
    }, 500);
}

function showMessage(main, sub = '') {
    messagePanel.classList.add('message-new');
    
    messageTextElement.innerHTML = main;
    messageSubElement.textContent = sub;
    
    setTimeout(() => {
        messagePanel.classList.remove('message-new');
    }, 500);
}

function showVictoryMessage(winner) {
    const winnerName = winner === 'X' ? 'JOGADOR X' : 'JOGADOR O';
    const emoji = winner === 'X' ? '🎉' : '🤖';
    
    messageTextElement.innerHTML = `${emoji} ${winnerName} VENCEU!`;
    messageSubElement.textContent = "Três em linha! Vitória épica!";
    
    // Efeito especial para vitória
    messagePanel.style.background = winner === 'X' 
        ? 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(10, 10, 25, 0.9))'
        : 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(10, 10, 25, 0.9))';
    
    setTimeout(() => {
        messagePanel.style.background = '';
    }, 2000);
}

// ===== TIMER =====
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    startTime = new Date();
    
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = new Date(now - startTime);
        
        const minutes = diff.getUTCMinutes().toString().padStart(2, '0');
        const seconds = diff.getUTCSeconds().toString().padStart(2, '0');
        
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// ===== EFEITOS VISUAIS =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posição aleatória
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Cor aleatória
        const colors = [
            'var(--vermelho-neon)',
            'var(--azul-neon)',
            'var(--amarelo-neon)',
            'var(--verde-neon)',
            'var(--roxo-neon)'
        ];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tamanho aleatório
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Animação
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.animation = `particleFloat ${duration}s linear ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}

function createHoverEffect(cell) {
    const rect = cell.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('particle');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
        sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
        sparkle.style.backgroundColor = currentPlayer === 'X' ? 'var(--azul-neon)' : 'var(--amarelo-neon)';
        sparkle.style.width = '2px';
        sparkle.style.height = '2px';
        sparkle.style.animation = 'sparkle 0.5s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 500);
    }
}

function createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.classList.add('ripple');
    ripple.style.left = `${rect.left + rect.width/2}px`;
    ripple.style.top = `${rect.top + rect.height/2}px`;
    ripple.style.borderColor = currentPlayer === 'X' ? 'var(--azul-neon)' : 'var(--amarelo-neon)';
    ripple.style.animation = 'rippleEffect 0.6s ease-out forwards';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createExplosionEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + rect.width/2}px`;
        particle.style.top = `${rect.top + rect.height/2}px`;
        particle.style.backgroundColor = currentPlayer === 'X' ? 'var(--azul-neon)' : 'var(--amarelo-neon)';
        
        const angle = (i / 10) * Math.PI * 2;
        const distance = 30;
        const duration = 0.8;
        
        const animation = document.createElement('style');
        animation.textContent = `
            @keyframes explode${i} {
                0% {
                    transform: translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(animation);
        particle.style.animation = `explode${i} ${duration}s ease-out forwards`;
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
        setTimeout(() => animation.remove(), duration * 1000);
    }
}

function createVictoryLine(combination) {
    const boardRect = boardElement.getBoundingClientRect();
    const cellSize = boardRect.width / 3;
    
    const [a, b, c] = combination;
    const rowA = Math.floor(a / 3);
    const colA = a % 3;
    const rowC = Math.floor(c / 3);
    const colC = c % 3;
    
    const line = document.createElement('div');
    line.classList.add('victory-line');
    
    // Posição e orientação da linha
    if (rowA === rowC) { // Linha horizontal
        line.style.top = `${(rowA + 0.5) * cellSize}px`;
        line.style.left = `${colA * cellSize}px`;
        line.style.width = `${(colC - colA + 1) * cellSize}px`;
    } else if (colA === colC) { // Coluna vertical
        line.style.left = `${(colA + 0.5) * cellSize}px`;
        line.style.top = `${rowA * cellSize}px`;
        line.style.width = `${(rowC - rowA + 1) * cellSize}px`;
        line.style.transform = 'rotate(90deg)';
        line.style.transformOrigin = 'left top';
    } else { // Diagonal
        line.style.top = `${rowA * cellSize}px`;
        line.style.left = `${colA * cellSize}px`;
        line.style.width = `${Math.sqrt(Math.pow((colC - colA) * cellSize, 2) + Math.pow((rowC - rowA) * cellSize, 2))}px`;
        
        const angle = Math.atan2((rowC - rowA) * cellSize, (colC - colA) * cellSize) * 180 / Math.PI;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = 'left top';
    }
    
    boardElement.parentElement.appendChild(line);
    
    boardElement.classList.add('board-victory');
}

function createVictoryEffects() {
    // Fogos de artifício
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 100);
    }
    
    // Efeito de brilho no tabuleiro
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('glow');
            setTimeout(() => cell.classList.remove('glow'), 300);
        }, index * 50);
    });
}

function createFirework() {
    const firework = document.createElement('div');
    firework.style.position = 'fixed';
    firework.style.left = `${Math.random() * 100}vw`;
    firework.style.top = `${Math.random() * 100}vh`;
    firework.style.width = '4px';
    firework.style.height = '4px';
    firework.style.borderRadius = '50%';
    firework.style.backgroundColor = ['var(--vermelho-neon)', 'var(--azul-neon)', 'var(--amarelo-neon)', 'var(--verde-neon)'][Math.floor(Math.random() * 4)];
    firework.style.zIndex = '9999';
    firework.style.boxShadow = '0 0 10px currentColor';
    
    document.body.appendChild(firework);
    
    const animation = firework.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
    
    animation.onfinish = () => firework.remove();
}

function createResetEffect() {
    // Efeito de onda pelo tabuleiro
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.style.transform = 'scale(0.8)';
            cell.style.opacity = '0.5';
            
            setTimeout(() => {
                cell.style.transform = '';
                cell.style.opacity = '';
            }, 200);
        }, index * 50);
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====
function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Erro ao tocar som:", e));
    }
}

function getAIDelay() {
    switch(difficulty) {
        case 'easy': return 800;
        case 'medium': return 500;
        case 'hard': return 300;
        default: return 500;
    }
}

// ===== INICIALIZAR JOGO =====
document.addEventListener('DOMContentLoaded', init);

// Adicionar algumas partículas extras no load
window.addEventListener('load', () => {
    // Efeito de entrada
    document.querySelector('.game-container').style.opacity = '0';
    document.querySelector('.game-container').style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.querySelector('.game-container').style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        document.querySelector('.game-container').style.opacity = '1';
        document.querySelector('.game-container').style.transform = 'translateY(0)';
    }, 100);
});
