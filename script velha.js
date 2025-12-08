document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DO DOM =====
    const gameBoard = document.getElementById('gameBoard');
    const currentPlayerElement = document.getElementById('currentPlayer');
    const gameStatusElement = document.getElementById('gameStatus');
    const gameMessageElement = document.getElementById('gameMessage');
    const messageTextElement = document.getElementById('messageText');
    const messagePlayerElement = document.getElementById('messagePlayer');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const scoreTieElement = document.getElementById('scoreTie');
    const resetButton = document.getElementById('resetButton');
    const newGameButton = document.getElementById('newGameButton');
    const modeButton = document.getElementById('modeButton');
    const modeTextElement = document.getElementById('modeText');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const particlesContainer = document.getElementById('particles');
    
    // ===== VARIÁVEIS DO JOGO =====
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false;
    let gameMode = 'twoPlayers'; // 'twoPlayers' ou 'vsComputer'
    let difficulty = 'medium'; // 'easy', 'medium', 'hard'
    let scores = {
        X: 0,
        O: 0,
        tie: 0
    };
    
    // ===== COMBINAÇÕES VENCEDORAS =====
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    
    // ===== INICIALIZAÇÃO DO JOGO =====
    function initializeGame() {
        createGameBoard();
        loadScores();
        setupEventListeners();
        createParticles();
        showWelcomeMessage();
    }
    
    // ===== CRIAR TABULEIRO =====
    function createGameBoard() {
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            
            // Efeito de entrada
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.8) rotateY(180deg)';
            
            // Adicionar evento de clique
            cell.addEventListener('click', () => handleCellClick(i));
            
            // Animação de entrada
            setTimeout(() => {
                cell.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1) rotateY(0)';
            }, i * 100);
            
            gameBoard.appendChild(cell);
        }
    }
    
    // ===== CONFIGURAR EVENTOS =====
    function setupEventListeners() {
        // Botões de controle
        resetButton.addEventListener('click', resetGame);
        newGameButton.addEventListener('click', newGame);
        modeButton.addEventListener('click', toggleGameMode);
        
        // Botões de dificuldade
        difficultyButtons.forEach(button => {
            button.addEventListener('click', function() {
                setDifficulty(this.dataset.difficulty);
                updateMessage(`Nível alterado para: ${this.querySelector('span').textContent}`);
            });
        });
    }
    
    // ===== MANIPULAR CLIQUE NA CÉLULA =====
    function handleCellClick(index) {
        if (!gameActive || board[index] !== '') return;
        
        // Efeito visual
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 200);
        
        // Fazer jogada
        makeMove(index, currentPlayer);
        
        // Verificar resultado
        if (checkResult()) return;
        
        // Se for modo contra IA
        if (gameMode === 'vsComputer' && gameActive) {
            currentPlayer = 'O';
            updateDisplay();
            updateMessage('IA da Noite está pensando...');
            
            setTimeout(() => {
                makeComputerMove();
            }, 800);
        } else {
            // Alternar jogador
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
            updateMessage(`Vez do jogador ${currentPlayer}`);
        }
    }
    
    // ===== FAZER JOGADA =====
    function makeMove(index, player) {
        board[index] = player;
        updateBoardDisplay();
        
        // Efeito de brilho
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.boxShadow = player === 'X' 
            ? '0 0 30px var(--azul-neon)' 
            : '0 0 30px #FFD700';
        
        setTimeout(() => {
            cell.style.boxShadow = '';
        }, 500);
    }
    
    // ===== JOGADA DA IA =====
    function makeComputerMove() {
        if (!gameActive || currentPlayer !== 'O') return;
        
        let moveIndex;
        
        switch(difficulty) {
            case 'easy':
                moveIndex = getEasyMove();
                break;
            case 'medium':
                moveIndex = getMediumMove();
                break;
            case 'hard':
                moveIndex = getHardMove();
                break;
        }
        
        if (moveIndex !== -1) {
            setTimeout(() => {
                makeMove(moveIndex, 'O');
                if (!checkResult()) {
                    currentPlayer = 'X';
                    updateDisplay();
                    updateMessage('Sua vez! Faça sua jogada.');
                }
            }, 600);
        }
    }
    
    // ===== ALGORITMOS DA IA =====
    function getEasyMove() {
        const emptyCells = board.map((cell, index) => cell === '' ? index : null)
                               .filter(val => val !== null);
        
        // 40% de chance de jogar mal
        if (Math.random() < 0.4 && emptyCells.length > 2) {
            const goodMoves = getWinningMoves('O').concat(getWinningMoves('X'));
            const badMoves = emptyCells.filter(index => !goodMoves.includes(index));
            if (badMoves.length > 0) {
                return badMoves[Math.floor(Math.random() * badMoves.length)];
            }
        }
        
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    function getMediumMove() {
        // Tentar vencer
        const winMove = findWinningMove('O');
        if (winMove !== -1) return winMove;
        
        // Bloquear jogador
        const blockMove = findWinningMove('X');
        if (blockMove !== -1) return blockMove;
        
        // Jogar no centro
        if (board[4] === '') return 4;
        
        // Jogar em canto
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => board[index] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Jogar em qualquer lugar
        const emptyCells = board.map((cell, index) => cell === '' ? index : null)
                               .filter(val => val !== null);
        return emptyCells[0];
    }
    
    function getHardMove() {
        // Algoritmo Minimax melhorado
        return minimax(board, 'O', true).index;
    }
    
    // ===== MINIMAX =====
    function minimax(newBoard, player, isMaximizing) {
        const gameResult = checkGameState(newBoard);
        
        if (gameResult === 'X') return { score: -10 };
        if (gameResult === 'O') return { score: 10 };
        if (gameResult === 'draw') return { score: 0 };
        
        const moves = [];
        
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                const move = { index: i };
                newBoard[i] = player;
                
                if (player === 'O') {
                    const result = minimax(newBoard, 'X', false);
                    move.score = result.score;
                } else {
                    const result = minimax(newBoard, 'O', true);
                    move.score = result.score;
                }
                
                newBoard[i] = '';
                moves.push(move);
            }
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
    
    // ===== FUNÇÕES AUXILIARES =====
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cells = [board[a], board[b], board[c]];
            
            const playerCount = cells.filter(cell => cell === player).length;
            const emptyCount = cells.filter(cell => cell === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                if (board[a] === '') return a;
                if (board[b] === '') return b;
                if (board[c] === '') return c;
            }
        }
        return -1;
    }
    
    function getWinningMoves(player) {
        const moves = [];
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cells = [board[a], board[b], board[c]];
            
            const playerCount = cells.filter(cell => cell === player).length;
            const emptyCount = cells.filter(cell => cell === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                if (board[a] === '') moves.push(a);
                if (board[b] === '') moves.push(b);
                if (board[c] === '') moves.push(c);
            }
        }
        return moves;
    }
    
    // ===== VERIFICAR RESULTADO =====
    function checkResult() {
        const result = checkGameState(board);
        
        if (result === 'X' || result === 'O') {
            gameActive = false;
            scores[result]++;
            saveScores();
            
            // Efeito de vitória
            createConfetti(result === 'X' ? 'blue' : 'gold');
            
            updateMessage(
                result === 'X' 
                    ? '🎉 VOCÊ VENCEU! A Fúria está com você!' 
                    : '💀 IA DA NOITE VENCEU! Tente novamente!',
                result === 'X' ? 'win' : 'lose'
            );
            
            return true;
        }
        
        if (result === 'draw') {
            gameActive = false;
            scores.tie++;
            saveScores();
            updateMessage('🤝 EMPATE! A batalha foi equilibrada!', 'draw');
            return true;
        }
        
        return false;
    }
    
    function checkGameState(boardState) {
        // Verificar vitórias
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                highlightWinningCells([a, b, c]);
                return boardState[a];
            }
        }
        
        // Verificar empate
        if (!boardState.includes('')) {
            return 'draw';
        }
        
        return null;
    }
    
    // ===== FUNÇÕES DE ATUALIZAÇÃO =====
    function updateBoardDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.className = 'cell';
            
            if (board[index] === 'X') {
                cell.classList.add('x');
            } else if (board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    }
    
    function updateDisplay() {
        updateBoardDisplay();
        updateScoreDisplay();
        updateCurrentPlayerDisplay();
    }
    
    function updateCurrentPlayerDisplay() {
        currentPlayerElement.textContent = currentPlayer;
        currentPlayerElement.style.color = currentPlayer === 'X' ? 'var(--azul-neon)' : '#FFD700';
        currentPlayerElement.style.textShadow = currentPlayer === 'X' 
            ? '0 0 20px var(--azul-neon)' 
            : '0 0 20px #FFD700';
    }
    
    function updateScoreDisplay() {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreTieElement.textContent = scores.tie;
    }
    
    function updateMessage(text, type = '') {
        const messagePlayer = type === 'win' ? 'X' : type === 'lose' ? 'O' : currentPlayer;
        
        messageTextElement.innerHTML = text;
        messagePlayerElement.textContent = messagePlayer;
        
        // Efeitos visuais
        const messageArea = document.querySelector('.game-message');
        messageArea.style.borderColor = type === 'win' ? 'var(--verde-neon)' : 
                                       type === 'lose' ? 'var(--vermelho-furia)' : 
                                       type === 'draw' ? '#FFD700' : 'var(--azul-neon)';
        
        messageArea.style.boxShadow = type === 'win' ? '0 0 30px var(--verde-neon)' :
                                     type === 'lose' ? '0 0 30px var(--vermelho-furia)' :
                                     type === 'draw' ? '0 0 30px #FFD700' : '0 0 30px var(--azul-neon)';
    }
    
    // ===== FUNÇÕES DE CONTROLE =====
    function startNewGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        updateDisplay();
        updateMessage('Vez do jogador X. Faça sua jogada!');
        
        // Efeito visual
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.style.transform = 'scale(0.8)';
            cell.style.opacity = '0.5';
            
            setTimeout(() => {
                cell.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, index * 50);
        });
    }
    
    function resetGame() {
        startNewGame();
        updateMessage('Partida reiniciada! Jogador X começa.');
    }
    
    function newGame() {
        if (confirm('Tem certeza que deseja começar um novo jogo? O placar será zerado.')) {
            scores = { X: 0, O: 0, tie: 0 };
            startNewGame();
            saveScores();
            updateMessage('Novo jogo iniciado! Placar zerado.');
        }
    }
    
    function toggleGameMode() {
        gameMode = gameMode === 'twoPlayers' ? 'vsComputer' : 'twoPlayers';
        modeTextElement.textContent = `Modo: ${gameMode === 'twoPlayers' ? '2 Jogadores' : 'vs Computador'}`;
        resetGame();
        updateMessage(`Modo alterado para: ${gameMode === 'twoPlayers' ? '2 Jogadores' : 'Contra IA'}`);
    }
    
    function setDifficulty(level) {
        difficulty = level;
        
        // Atualizar botões ativos
        difficultyButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === level) {
                btn.classList.add('active');
            }
        });
    }
    
    // ===== EFEITOS VISUAIS =====
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'var(--azul-neon)' : 'var(--vermelho-furia)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = '0.3';
        particle.style.pointerEvents = 'none';
        
        particlesContainer.appendChild(particle);
        
        // Animação
        particle.animate([
            { transform: 'translateY(0px)', opacity: 0.3 },
            { transform: `translateY(${Math.random() * 100 - 50}px)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'ease-in-out'
        }).onfinish = () => {
            particle.remove();
            setTimeout(createParticle, Math.random() * 1000);
        };
    }
    
    function createConfetti(color) {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = color;
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('winner');
        });
    }
    
    function showWelcomeMessage() {
        setTimeout(() => {
            updateMessage('Bem-vindo ao Jogo da Velha da Fúria! Clique em "Novo Jogo" para começar.');
        }, 1000);
    }
    
    // ===== SALVAR/CARREGAR PONTUAÇÃO =====
    function saveScores() {
        localStorage.setItem('furiaTicTacToeScores', JSON.stringify(scores));
        updateScoreDisplay();
    }
    
    function loadScores() {
        const savedScores = localStorage.getItem('furiaTicTacToeScores');
        if (savedScores) {
            scores = JSON.parse(savedScores);
            updateScoreDisplay();
        }
    }
    
    // ===== INICIALIZAR JOGO =====
    initializeGame();
    
    // Configurar botão para iniciar jogo
    newGameButton.addEventListener('click', startNewGame);
});
