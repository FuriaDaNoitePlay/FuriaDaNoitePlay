document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const gameBoard = document.getElementById('gameBoard');
    const currentPlayerElement = document.getElementById('currentPlayer');
    const gameStatusElement = document.getElementById('gameStatus');
    const gameMessageElement = document.getElementById('gameMessage');
    const messagePlayerElement = document.getElementById('messagePlayer');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const scoreTieElement = document.getElementById('scoreTie');
    const resetButton = document.getElementById('resetButton');
    const newGameButton = document.getElementById('newGameButton');
    const modeButton = document.getElementById('modeButton');
    
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
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    
    // Inicializar o tabuleiro
    function initGameBoard() {
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            
            // Adicionar evento de clique
            cell.addEventListener('click', () => handleCellClick(i));
            
            // Adicionar efeito de entrada
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                cell.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, i * 100);
            
            gameBoard.appendChild(cell);
        }
        
        updateDisplay();
        updateMessage(`Vez do jogador ${currentPlayer}`);
    }
    
    // Atualizar a exibição
    function updateDisplay() {
        // Atualizar células
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
        
        // Atualizar jogador atual
        currentPlayerElement.textContent = currentPlayer;
        currentPlayerElement.style.color = currentPlayer === 'X' ? '#ff4757' : '#3742fa';
        
        // Atualizar placar
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreTieElement.textContent = scores.tie;
        
        // Atualizar texto do botão de modo
        modeButton.innerHTML = `<i class="fas fa-robot"></i> Modo: ${gameMode === 'twoPlayers' ? '2 Jogadores' : 'vs Computador'}`;
    }
    
    // Atualizar mensagem
    function updateMessage(message) {
        gameMessageElement.innerHTML = `<p>${message}</p>`;
    }
    
    // Lidar com clique na célula
    function handleCellClick(index) {
        // Verificar se a célula está vazia e se o jogo está ativo
        if (board[index] !== '' || !gameActive) {
            return;
        }
        
        // Fazer a jogada
        makeMove(index);
        
        // Verificar resultado
        checkResult();
        
        // Se for modo contra computador e não houver vencedor, fazer jogada do computador
        if (gameActive && gameMode === 'vsComputer' && currentPlayer === 'O') {
            setTimeout(makeComputerMove, 800);
        }
    }
    
    // Fazer uma jogada
    function makeMove(index) {
        board[index] = currentPlayer;
        updateDisplay();
        
        // Efeito visual na célula
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Verificar resultado do jogo
    function checkResult() {
        let roundWon = false;
        let winner = null;
        
        // Verificar todas as combinações vencedoras
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            
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
            updateMessage(`<span style="color:${winner === 'X' ? '#ff4757' : '#3742fa'}">Jogador ${winner}</span> venceu!`);
            
            // Atualizar placar
            scores[winner]++;
            updateDisplay();
            
            // Efeito de confete visual
            createConfetti();
            return;
        }
        
        // Verificar empate
        const roundDraw = !board.includes('');
        if (roundDraw) {
            gameActive = false;
            updateMessage('Empate!');
            
            // Atualizar placar
            scores.tie++;
            updateDisplay();
            return;
        }
        
        // Mudar jogador se o jogo ainda estiver ativo
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
            
            if (gameMode === 'twoPlayers') {
                updateMessage(`Vez do jogador ${currentPlayer}`);
            } else {
                if (currentPlayer === 'X') {
                    updateMessage(`Sua vez (${currentPlayer})`);
                } else {
                    updateMessage('Vez do computador...');
                }
            }
        }
    }
    
    // Fazer jogada do computador
    function makeComputerMove() {
        if (!gameActive || currentPlayer !== 'O') return;
        
        let moveIndex = -1;
        
        // Estratégia do computador
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
            const availableCells = [];
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    availableCells.push(i);
                }
            }
            
            if (availableCells.length > 0) {
                moveIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            }
        }
        
        // Fazer a jogada
        if (moveIndex !== -1) {
            // Pequeno delay para parecer que o computador está "pensando"
            setTimeout(() => {
                makeMove(moveIndex);
                checkResult();
            }, 500);
        }
    }
    
    // Encontrar jogada vencedora
    function findWinningMove(player) {
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            
            // Verificar se duas células estão com o mesmo símbolo e a terceira está vazia
            const cells = [board[a], board[b], board[c]];
            const playerCount = cells.filter(cell => cell === player).length;
            const emptyCount = cells.filter(cell => cell === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                // Encontrar o índice da célula vazia
                if (board[a] === '') return a;
                if (board[b] === '') return b;
                if (board[c] === '') return c;
            }
        }
        
        return -1;
    }
    
    // Criar efeito de confete
    function createConfetti() {
        const colors = ['#ff4757', '#3742fa', '#2ed573', '#ffa502', '#7158e2'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animação
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            // Remover após animação
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // Reiniciar partida
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        updateDisplay();
        updateMessage(`Vez do jogador ${currentPlayer}`);
        
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
    
    // Novo jogo (zerar placar)
    function newGame() {
        scores = { X: 0, O: 0, tie: 0 };
        resetGame();
        
        // Efeito visual
        gameMessageElement.style.transform = 'scale(1.1)';
        gameMessageElement.style.color = '#2ed573';
        
        setTimeout(() => {
            gameMessageElement.style.transform = 'scale(1)';
            gameMessageElement.style.color = '';
        }, 300);
    }
    
    // Alterar modo de jogo
    function toggleGameMode() {
        gameMode = gameMode === 'twoPlayers' ? 'vsComputer' : 'twoPlayers';
        resetGame();
        
        // Efeito visual
        modeButton.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            modeButton.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Adicionar eventos aos botões
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
    modeButton.addEventListener('click', toggleGameMode);
    
    // Efeito de entrada na página
    const elements = document.querySelectorAll('.game-main > *');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
    
    // Inicializar o jogo
    initGameBoard();
});
