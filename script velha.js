document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const gameBoard = document.getElementById('gameBoard');
    const playerTurnElement = document.getElementById('playerTurn');
    const messageElement = document.getElementById('message');
    const resetBtn = document.getElementById('resetBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const changeModeBtn = document.getElementById('changeModeBtn');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const scoreTieElement = document.getElementById('scoreTie');
    
    // Variáveis do jogo
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'twoPlayers'; // 'twoPlayers' ou 'vsComputer'
    let scores = {
        X: 0,
        O: 0,
        tie: 0
    };
    
    // Combinações vencedoras
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    
    // Inicializar o tabuleiro
    function initializeBoard() {
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            
            cell.addEventListener('click', () => handleCellClick(i));
            
            gameBoard.appendChild(cell);
        }
        
        updateDisplay();
    }
    
    // Atualizar a exibição do jogo
    function updateDisplay() {
        // Atualizar as células
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
        
        // Atualizar o jogador atual
        const playerSpan = playerTurnElement.querySelector('span');
        playerSpan.textContent = currentPlayer;
        playerSpan.className = currentPlayer === 'X' ? 'player-x' : 'player-o';
        
        // Atualizar os placares
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreTieElement.textContent = scores.tie;
        
        // Atualizar o texto do botão de modo
        changeModeBtn.innerHTML = `<i class="fas fa-robot"></i> Modo: ${gameMode === 'twoPlayers' ? '2 Jogadores' : 'vs Computador'}`;
    }
    
    // Lidar com clique na célula
    function handleCellClick(index) {
        // Verificar se a célula está vazia e se o jogo está ativo
        if (board[index] !== '' || !gameActive) {
            return;
        }
        
        // Fazer a jogada
        makeMove(index);
        
        // Verificar se houve um vencedor ou empate
        checkGameResult();
        
        // Se for modo contra computador e não houver vencedor, fazer jogada do computador
        if (gameActive && gameMode === 'vsComputer' && currentPlayer === 'O') {
            setTimeout(makeComputerMove, 500);
        }
    }
    
    // Fazer uma jogada
    function makeMove(index) {
        board[index] = currentPlayer;
        updateDisplay();
    }
    
    // Verificar resultado do jogo
    function checkGameResult() {
        let roundWon = false;
        let winner = null;
        
        // Verificar todas as combinações vencedoras
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (board[a] === '' || board[b] === '' || board[c] === '') {
                continue;
            }
            
            if (board[a] === board[b] && board[b] === board[c]) {
                roundWon = true;
                winner = board[a];
                
                // Destacar células vencedoras
                document.querySelector(`.cell[data-index="${a}"]`).classList.add('winner');
                document.querySelector(`.cell[data-index="${b}"]`).classList.add('winner');
                document.querySelector(`.cell[data-index="${c}"]`).classList.add('winner');
                break;
            }
        }
        
        // Se houver um vencedor
        if (roundWon) {
            gameActive = false;
            messageElement.innerHTML = `<p>Jogador <span class="${winner === 'X' ? 'player-x' : 'player-o'}">${winner}</span> venceu!</p>`;
            
            // Atualizar placar
            scores[winner]++;
            updateDisplay();
            return;
        }
        
        // Verificar empate
        const roundDraw = !board.includes('');
        if (roundDraw) {
            gameActive = false;
            messageElement.innerHTML = '<p>Empate!</p>';
            
            // Atualizar placar de empates
            scores.tie++;
            updateDisplay();
            return;
        }
        
        // Mudar jogador se o jogo ainda estiver ativo
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
            messageElement.innerHTML = `<p>Vez do jogador <span class="${currentPlayer === 'X' ? 'player-x' : 'player-o'}">${currentPlayer}</span></p>`;
        }
    }
    
    // Fazer jogada do computador
    function makeComputerMove() {
        if (!gameActive || currentPlayer !== 'O') return;
        
        // Estratégia simples do computador:
        // 1. Tentar vencer
        // 2. Bloquear o jogador de vencer
        // 3. Jogar no centro
        // 4. Jogar em um canto
        // 5. Jogar em qualquer lugar disponível
        
        let moveIndex = -1;
        
        // 1. Tentar vencer
        moveIndex = findWinningMove('O');
        
        // 2. Bloquear jogador humano
        if (moveIndex === -1) {
            moveIndex = findWinningMove('X');
        }
        
        // 3. Jogar no centro
        if (moveIndex === -1 && board[4] === '') {
            moveIndex = 4;
        }
        
        // 4. Jogar em um canto
        if (moveIndex === -1) {
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(index => board[index] === '');
            if (availableCorners.length > 0) {
                moveIndex = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
        }
        
        // 5. Jogar em qualquer lugar disponível
        if (moveIndex === -1) {
            const availableCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            moveIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        }
        
        // Fazer a jogada
        if (moveIndex !== -1) {
            makeMove(moveIndex);
            checkGameResult();
        }
    }
    
    // Encontrar jogada vencedora
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Verificar se duas células estão com o mesmo símbolo e a terceira está vazia
            const cells = [board[a], board[b], board[c]];
            const emptyIndex = [a, b, c].find(index => board[index] === '');
            
            if (cells.filter(cell => cell === player).length === 2 && emptyIndex !== undefined) {
                return emptyIndex;
            }
        }
        
        return -1;
    }
    
    // Reiniciar o jogo (mantendo o placar)
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        messageElement.innerHTML = '<p>Comece clicando em qualquer célula!</p>';
        initializeBoard();
    }
    
    // Novo jogo (zerar placar)
    function newGame() {
        scores = { X: 0, O: 0, tie: 0 };
        resetGame();
    }
    
    // Alterar modo de jogo
    function changeGameMode() {
        gameMode = gameMode === 'twoPlayers' ? 'vsComputer' : 'twoPlayers';
        resetGame();
    }
    
    // Adicionar eventos aos botões
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    changeModeBtn.addEventListener('click', changeGameMode);
    
    // Inicializar o jogo
    initializeBoard();
    
    // Adicionar efeito de digitação na mensagem inicial
    const originalMessage = messageElement.innerHTML;
    messageElement.innerHTML = '';
    
    let charIndex = 0;
    const typingEffect = setInterval(() => {
        if (charIndex < originalMessage.length) {
            messageElement.innerHTML += originalMessage.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingEffect);
        }
    }, 30);
});
