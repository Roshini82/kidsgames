class MemoryGame {
    constructor() {
        this.cards = [
            '🍎', '🍎', '🍌', '🍌',
            '🍊', '🍊', '🍇', '🍇',
            '🍓', '🍓', '🍑', '🍑',
            '🥝', '🥝', '🍍', '🍍'
        ];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.shuffleCards();
        this.createBoard();
        this.updateDisplay();
        this.startTimer();
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.dataset.emoji = card;
            cardElement.addEventListener('click', () => this.flipCard(index));
            gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(index) {
        if (!this.gameStarted) {
            this.gameStarted = true;
        }
        
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        
        // Don't flip if card is already flipped or matched
        if (cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') || 
            this.flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        cardElement.classList.add('flipped');
        cardElement.textContent = cardElement.dataset.emoji;
        this.flippedCards.push(index);
        
        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }
    
    checkMatch() {
        const [firstIndex, secondIndex] = this.flippedCards;
        const firstCard = document.querySelector(`[data-index="${firstIndex}"]`);
        const secondCard = document.querySelector(`[data-index="${secondIndex}"]`);
        
        if (this.cards[firstIndex] === this.cards[secondIndex]) {
            // Match found
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            this.matchedCards.push(firstIndex, secondIndex);
            this.score += 10;
            
            // Check if game is won
            if (this.matchedCards.length === this.cards.length) {
                this.gameWon();
            }
        } else {
            // No match
            firstCard.classList.add('wrong');
            secondCard.classList.add('wrong');
            
            setTimeout(() => {
                firstCard.classList.remove('flipped', 'wrong');
                secondCard.classList.remove('flipped', 'wrong');
                firstCard.textContent = '';
                secondCard.textContent = '';
            }, 500);
        }
        
        this.flippedCards = [];
        this.updateDisplay();
    }
    
    gameWon() {
        clearInterval(this.timerInterval);
        const gameStatus = document.getElementById('gameStatus');
        gameStatus.innerHTML = `
            <div class="win">
                🎉 Congratulations! You won! 🎉<br>
                Score: ${this.score} | Moves: ${this.moves} | Time: ${this.formatTime(this.timer)}
            </div>
        `;
        gameStatus.classList.add('win');
        
        // Add celebration effect
        this.celebrateWin();
    }
    
    celebrateWin() {
        const cards = document.querySelectorAll('.memory-card.matched');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'celebration 0.5s ease';
            }, index * 100);
        });
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameStarted) {
                this.timer++;
                this.updateDisplay();
            }
        }, 1000);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('timer').textContent = this.formatTime(this.timer);
    }
}

// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new MemoryGame();
});

// New game function
function startNewGame() {
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
    }
    
    // Reset game state
    game.flippedCards = [];
    game.matchedCards = [];
    game.moves = 0;
    game.score = 0;
    game.timer = 0;
    game.gameStarted = false;
    
    // Reset UI
    const gameStatus = document.getElementById('gameStatus');
    gameStatus.innerHTML = '<p>Click on cards to find matching pairs!</p>';
    gameStatus.classList.remove('win');
    
    // Restart game
    game.initializeGame();
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add welcome message
    setTimeout(() => {
        console.log('🧩 Welcome to Memory Match! Find all the matching pairs! 🎯');
    }, 1000);
});
