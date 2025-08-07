// Game configuration
const GRID_WIDTH = 19;
const GRID_HEIGHT = 21;

// Game state
let gameState = {
    score: 0,
    lives: 3,
    gameRunning: true,
    pacmanPosition: { x: 9, y: 15 },
    ghostPosition: { x: 9, y: 9 },
    pacmanDirection: 'right',
    ghostDirection: 'up',
    totalDots: 0,
    dotsEaten: 0
};

// Simple maze layout (1 = wall, 0 = path with dot, 2 = path without dot)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1],
    [2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2],
    [1,1,1,1,0,1,2,1,2,2,2,1,2,1,0,1,1,1,1],
    [2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
    [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Initialize the game
function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Count total dots
    gameState.totalDots = 0;
    gameState.dotsEaten = 0;
    
    // Create the maze
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            
            if (maze[y][x] === 1) {
                cell.classList.add('wall');
            } else if (maze[y][x] === 0) {
                cell.classList.add('path', 'dot');
                gameState.totalDots++;
            } else {
                cell.classList.add('path');
            }
            
            gameBoard.appendChild(cell);
        }
    }
    
    // Place Pac-Man and ghost
    updateDisplay();
    updateScore();
    updateLives();
    
    // Start ghost movement
    setInterval(moveGhost, 300);
}

// Update the visual display
function updateDisplay() {
    // Clear previous positions
    document.querySelectorAll('.pacman, .ghost').forEach(el => {
        el.classList.remove('pacman', 'ghost', 'right', 'left', 'up', 'down');
    });
    
    // Place Pac-Man
    const pacmanCell = document.querySelector(`[data-x="${gameState.pacmanPosition.x}"][data-y="${gameState.pacmanPosition.y}"]`);
    if (pacmanCell) {
        pacmanCell.classList.add('pacman', gameState.pacmanDirection);
        
        // Check if Pac-Man is on a dot
        if (pacmanCell.classList.contains('dot')) {
            pacmanCell.classList.remove('dot');
            gameState.score += 10;
            gameState.dotsEaten++;
            updateScore();
            
            // Check win condition
            if (gameState.dotsEaten >= gameState.totalDots) {
                gameWin();
            }
        }
    }
    
    // Place ghost
    const ghostCell = document.querySelector(`[data-x="${gameState.ghostPosition.x}"][data-y="${gameState.ghostPosition.y}"]`);
    if (ghostCell) {
        ghostCell.classList.add('ghost');
    }
    
    // Check collision
    if (gameState.pacmanPosition.x === gameState.ghostPosition.x && 
        gameState.pacmanPosition.y === gameState.ghostPosition.y) {
        handleCollision();
    }
}

// Move Pac-Man
function movePacman(direction) {
    if (!gameState.gameRunning) return;
    
    let newX = gameState.pacmanPosition.x;
    let newY = gameState.pacmanPosition.y;
    
    switch (direction) {
        case 'up':
            newY--;
            break;
        case 'down':
            newY++;
            break;
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
    }
    
    // Check boundaries and walls
    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        if (maze[newY][newX] !== 1) {
            gameState.pacmanPosition.x = newX;
            gameState.pacmanPosition.y = newY;
            gameState.pacmanDirection = direction;
            updateDisplay();
        }
    }
}

// Move ghost (simple AI)
function moveGhost() {
    if (!gameState.gameRunning) return;
    
    const directions = ['up', 'down', 'left', 'right'];
    let validMoves = [];
    
    directions.forEach(direction => {
        let newX = gameState.ghostPosition.x;
        let newY = gameState.ghostPosition.y;
        
        switch (direction) {
            case 'up':
                newY--;
                break;
            case 'down':
                newY++;
                break;
            case 'left':
                newX--;
                break;
            case 'right':
                newX++;
                break;
        }
        
        // Check if move is valid
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            if (maze[newY][newX] !== 1) {
                validMoves.push({ direction, x: newX, y: newY });
            }
        }
    });
    
    if (validMoves.length > 0) {
        // Simple AI: move towards Pac-Man
        let bestMove = validMoves[0];
        let shortestDistance = Infinity;
        
        validMoves.forEach(move => {
            const distance = Math.abs(move.x - gameState.pacmanPosition.x) + 
                           Math.abs(move.y - gameState.pacmanPosition.y);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestMove = move;
            }
        });
        
        gameState.ghostPosition.x = bestMove.x;
        gameState.ghostPosition.y = bestMove.y;
        gameState.ghostDirection = bestMove.direction;
        updateDisplay();
    }
}

// Handle collision between Pac-Man and ghost
function handleCollision() {
    gameState.lives--;
    updateLives();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        // Reset positions
        gameState.pacmanPosition = { x: 9, y: 15 };
        gameState.ghostPosition = { x: 9, y: 9 };
        updateDisplay();
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

// Update lives display
function updateLives() {
    document.getElementById('lives').textContent = gameState.lives;
}

// Game over
function gameOver() {
    gameState.gameRunning = false;
    document.getElementById('game-status').textContent = 'GAME OVER';
    document.getElementById('game-status').classList.add('game-over');
}

// Game win
function gameWin() {
    gameState.gameRunning = false;
    document.getElementById('game-status').textContent = 'YOU WIN!';
    document.getElementById('game-status').classList.add('game-win');
}

// Restart game
function restartGame() {
    gameState = {
        score: 0,
        lives: 3,
        gameRunning: true,
        pacmanPosition: { x: 9, y: 15 },
        ghostPosition: { x: 9, y: 9 },
        pacmanDirection: 'right',
        ghostDirection: 'up',
        totalDots: 0,
        dotsEaten: 0
    };
    
    document.getElementById('game-status').textContent = '';
    document.getElementById('game-status').classList.remove('game-over', 'game-win');
    
    initGame();
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            movePacman('up');
            break;
        case 'ArrowDown':
            event.preventDefault();
            movePacman('down');
            break;
        case 'ArrowLeft':
            event.preventDefault();
            movePacman('left');
            break;
        case 'ArrowRight':
            event.preventDefault();
            movePacman('right');
            break;
    }
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
