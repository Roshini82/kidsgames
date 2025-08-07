// Snake Game Logic
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.gridSize = 24;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.piesEaten = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Speed settings
        this.baseSpeed = 150;
        this.currentSpeed = this.baseSpeed;
        this.speedIncrease = 5;
        
        // Load best scores
        this.loadBestScores();
        
        // Initialize
        this.generateFood();
        this.setupControls();
        this.updateDisplay();
        this.draw();
        
        // Motivational messages
        this.eatMessages = [
            "Yummy pie! 🥧",
            "Delicious! 😋",
            "Nom nom nom! 🍴",
            "Tasty! 👨‍🍳",
            "More pie! 🥧",
            "Growing strong! 💪",
            "Keep eating! 🐍"
        ];
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning && !this.gamePaused) return;
            
            // Prevent snake from going backwards
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    e.preventDefault();
                    break;
                case ' ':
                    this.togglePause();
                    e.preventDefault();
                    break;
            }
        });
    }
    
    generateFood() {
        let foodPosition;
        do {
            foodPosition = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.isSnakePosition(foodPosition));
        
        this.food = foodPosition;
    }
    
    isSnakePosition(position) {
        return this.snake.some(segment => 
            segment.x === position.x && segment.y === position.y
        );
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Move snake head
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.isSnakePosition(head)) {
            this.gameOver();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.draw();
    }
    
    eatFood() {
        this.score += 10;
        this.piesEaten++;
        
        // Increase speed slightly
        if (this.piesEaten % 3 === 0) {
            this.currentSpeed = Math.max(80, this.currentSpeed - this.speedIncrease);
        }
        
        this.generateFood();
        this.updateDisplay();
        this.updateSpeechBubble();
        
        // Visual feedback
        this.showEatFeedback();
    }
    
    showEatFeedback() {
        const message = this.eatMessages[Math.floor(Math.random() * this.eatMessages.length)];
        const speechBubble = document.getElementById('speechBubble');
        const originalText = speechBubble.textContent;
        
        speechBubble.textContent = message;
        speechBubble.style.background = '#2ed573';
        speechBubble.style.color = 'white';
        speechBubble.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            speechBubble.textContent = originalText;
            speechBubble.style.background = '#fff';
            speechBubble.style.color = '#2c3e50';
            speechBubble.style.transform = 'scale(1)';
        }, 1500);
    }
    
    draw() {
        // Clear canvas with very bright white background for maximum contrast
        this.ctx.fillStyle = '#FFFFFF'; // Pure white background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid pattern with very light gray lines
        this.ctx.strokeStyle = '#F0F0F0'; // Very light gray
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake with very bright, high contrast colors
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head - very bright red for maximum visibility
                this.ctx.fillStyle = '#FF0000'; // Bright red
                this.ctx.strokeStyle = '#8B0000'; // Dark red border
            } else {
                // Snake body - very bright orange for maximum visibility
                this.ctx.fillStyle = '#FF4500'; // Orange red
                this.ctx.strokeStyle = '#B22222'; // Fire brick border
            }
            
            this.ctx.lineWidth = 6;
            // Make segments much larger for better visibility
            const x = segment.x * this.gridSize + 2;
            const y = segment.y * this.gridSize + 2;
            const size = this.gridSize - 4;
            const radius = 8;
            
            // Draw rounded rectangle manually
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + size - radius, y);
            this.ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
            this.ctx.lineTo(x + size, y + size - radius);
            this.ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
            this.ctx.lineTo(x + radius, y + size);
            this.ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
        
        // Draw food (pie)
        this.drawPie(this.food.x * this.gridSize, this.food.y * this.gridSize);
    }
    
    drawPie(x, y) {
        const centerX = x + this.gridSize / 2;
        const centerY = y + this.gridSize / 2;
        const radius = this.gridSize / 2.5; // Make pie larger
        
        // Pie crust - very bright yellow
        this.ctx.fillStyle = '#FFFF00'; // Bright yellow
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Pie filling - very bright purple
        this.ctx.fillStyle = '#FF00FF'; // Bright magenta
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius - 3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Pie details - thick black outline
        this.ctx.strokeStyle = '#000000'; // Black
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Add bright pie lines
        this.ctx.strokeStyle = '#FF0000'; // Bright red
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - radius/2, centerY);
        this.ctx.lineTo(centerX + radius/2, centerY);
        this.ctx.moveTo(centerX, centerY - radius/2);
        this.ctx.lineTo(centerX, centerY + radius/2);
        this.ctx.stroke();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.updateBestScores();
        this.showGameOverScreen();
        this.updateSpeechBubble();
    }
    
    showGameOverScreen() {
        document.getElementById('finalScore').textContent = `You ate ${this.piesEaten} pies!`;
        document.getElementById('finalLength').textContent = `Final length: ${this.snake.length}`;
        
        // Show the main overlay first
        const overlay = document.getElementById('gameOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
        
        document.getElementById('gameOverScreen').style.display = 'block';
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('pauseScreen').style.display = 'none';
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        const overlay = document.getElementById('gameOverlay');
        if (this.gamePaused) {
            if (overlay) overlay.style.display = 'flex';
            document.getElementById('pauseScreen').style.display = 'block';
        } else {
            if (overlay) overlay.style.display = 'none';
            document.getElementById('pauseScreen').style.display = 'none';
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('piesEaten').textContent = this.piesEaten;
        document.getElementById('snakeLength').textContent = this.snake.length;
        
        // Update speed display
        let speedText = 'Normal';
        if (this.currentSpeed <= 100) speedText = 'Fast';
        if (this.currentSpeed <= 80) speedText = 'Very Fast';
        document.getElementById('currentSpeed').textContent = speedText;
    }
    
    updateSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        
        if (!this.gameRunning && this.snake.length > 3) {
            if (this.piesEaten >= 10) {
                speechBubble.textContent = "Amazing! You're a pie-eating champion! 👑";
            } else if (this.piesEaten >= 5) {
                speechBubble.textContent = "Great job! The snake loved those pies! 🐍";
            } else {
                speechBubble.textContent = "Good try! Keep practicing! 😊";
            }
        } else if (this.gamePaused) {
            speechBubble.textContent = "Game paused! Take a break! ⏸️";
        } else if (this.gameRunning) {
            if (this.piesEaten >= 5) {
                speechBubble.textContent = "You're getting fast! Keep going! 🚀";
            } else {
                speechBubble.textContent = "Guide the snake to eat pies! 🥧";
            }
        } else {
            speechBubble.textContent = "Help the snake eat delicious pies!";
        }
    }
    
    loadBestScores() {
        this.bestScore = parseInt(localStorage.getItem('snakeBestScore') || '0');
        this.bestLength = parseInt(localStorage.getItem('snakeBestLength') || '3');
        document.getElementById('bestScore').textContent = this.bestScore;
        document.getElementById('bestLength').textContent = this.bestLength;
    }
    
    updateBestScores() {
        if (this.piesEaten > this.bestScore) {
            this.bestScore = this.piesEaten;
            localStorage.setItem('snakeBestScore', this.bestScore.toString());
            document.getElementById('bestScore').textContent = this.bestScore;
        }
        
        if (this.snake.length > this.bestLength) {
            this.bestLength = this.snake.length;
            localStorage.setItem('snakeBestLength', this.bestLength.toString());
            document.getElementById('bestLength').textContent = this.bestLength;
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.dx = 1; // Start moving right
        this.dy = 0;
        
        // Hide all overlay screens
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('pauseScreen').style.display = 'none';
        
        // Hide the main overlay to show the canvas
        const overlay = document.getElementById('gameOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        this.updateSpeechBubble();
        this.gameLoop();
    }
    
    restart() {
        // Reset game state
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.piesEaten = 0;
        this.currentSpeed = this.baseSpeed;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.generateFood();
        this.updateDisplay();
        this.draw();
        
        // Show the main overlay with start screen
        const overlay = document.getElementById('gameOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
        
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('pauseScreen').style.display = 'none';
        
        this.updateSpeechBubble();
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            setTimeout(() => this.gameLoop(), this.currentSpeed);
        }
    }
}

// Game instance
let snakeGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    snakeGame = new SnakeGame();
});

// Control functions
function startGame() {
    snakeGame.start();
}

function restartGame() {
    snakeGame.restart();
}

function resumeGame() {
    snakeGame.togglePause();
}

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}
