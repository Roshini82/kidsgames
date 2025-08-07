// Number Counting Game Logic
class CountingGame {
    constructor() {
        this.objects = [
            { name: 'apples', emoji: '🍎' },
            { name: 'bananas', emoji: '🍌' },
            { name: 'oranges', emoji: '🍊' },
            { name: 'strawberries', emoji: '🍓' },
            { name: 'cherries', emoji: '🍒' },
            { name: 'grapes', emoji: '🍇' },
            { name: 'cars', emoji: '🚗' },
            { name: 'balls', emoji: '⚽' },
            { name: 'flowers', emoji: '🌸' },
            { name: 'stars', emoji: '⭐' },
            { name: 'hearts', emoji: '❤️' },
            { name: 'butterflies', emoji: '🦋' }
        ];
        
        this.currentCount = 0;
        this.currentObject = null;
        this.score = 0;
        this.level = 1;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.maxQuestions = 12;
        
        this.speechBubble = document.getElementById('speechBubble');
        this.objectsArea = document.getElementById('objectsArea');
        this.objectType = document.getElementById('objectType');
        this.numbersGrid = document.getElementById('numbersGrid');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.encouragingMessages = [
            "Perfect counting! 🎉",
            "You're amazing! ⭐",
            "Great job! 🌟",
            "Excellent! 👏",
            "Wonderful! 🎊",
            "Fantastic! 🎯",
            "Super counting! 🚀",
            "Brilliant! ✨"
        ];
        
        this.startNewGame();
    }
    
    startNewGame() {
        this.generateQuestion();
        this.updateDisplay();
    }
    
    generateQuestion() {
        // Choose random object
        this.currentObject = this.objects[Math.floor(Math.random() * this.objects.length)];
        
        // Generate random count based on level
        let maxCount = Math.min(3 + this.level, 10);
        this.currentCount = Math.floor(Math.random() * maxCount) + 1;
        
        // Display objects
        this.displayObjects();
        
        // Create number options
        this.createNumberOptions();
        
        // Update question text
        this.objectType.textContent = this.currentObject.name;
        this.speechBubble.textContent = `Count all the ${this.currentObject.name} and click the right number!`;
        
        // Hide next button
        this.nextBtn.style.display = 'none';
    }
    
    displayObjects() {
        this.objectsArea.innerHTML = '';
        
        // Create array of positions for more random placement
        const positions = [];
        for (let i = 0; i < this.currentCount; i++) {
            positions.push(i);
        }
        this.shuffleArray(positions);
        
        positions.forEach((_, index) => {
            setTimeout(() => {
                const objectDiv = document.createElement('div');
                objectDiv.className = 'count-object';
                objectDiv.textContent = this.currentObject.emoji;
                
                // Add click animation for fun
                objectDiv.addEventListener('click', () => {
                    objectDiv.classList.add('counted');
                    setTimeout(() => {
                        objectDiv.classList.remove('counted');
                    }, 600);
                });
                
                this.objectsArea.appendChild(objectDiv);
            }, index * 200); // Stagger animation
        });
    }
    
    createNumberOptions() {
        this.numbersGrid.innerHTML = '';
        
        // Create options array with correct answer and 3 wrong answers
        const options = [this.currentCount];
        const maxNumber = Math.max(10, this.currentCount + 3);
        
        while (options.length < 4) {
            const randomNum = Math.floor(Math.random() * maxNumber) + 1;
            if (!options.includes(randomNum)) {
                options.push(randomNum);
            }
        }
        
        // Shuffle options
        this.shuffleArray(options);
        
        // Create number buttons
        options.forEach(number => {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'number-option';
            numberDiv.textContent = number;
            
            numberDiv.addEventListener('click', () => this.selectNumber(number, numberDiv));
            this.numbersGrid.appendChild(numberDiv);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    selectNumber(selectedNumber, numberElement) {
        // Disable all options
        const allOptions = document.querySelectorAll('.number-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        this.totalQuestions++;
        
        if (selectedNumber === this.currentCount) {
            // Correct answer
            numberElement.classList.add('correct');
            this.score += 10;
            this.correctAnswers++;
            
            // Bonus points for higher levels
            if (this.level > 1) {
                this.score += (this.level - 1) * 2;
            }
            
            const message = this.encouragingMessages[Math.floor(Math.random() * this.encouragingMessages.length)];
            this.speechBubble.textContent = `${message} There are exactly ${this.currentCount} ${this.currentObject.name}!`;
            
            // Make all objects pulse to show the count
            const objects = document.querySelectorAll('.count-object');
            objects.forEach((obj, index) => {
                setTimeout(() => {
                    obj.classList.add('counted');
                    setTimeout(() => {
                        obj.classList.remove('counted');
                    }, 600);
                }, index * 100);
            });
            
        } else {
            // Wrong answer
            numberElement.classList.add('wrong');
            
            // Highlight correct answer
            allOptions.forEach(option => {
                if (parseInt(option.textContent) === this.currentCount) {
                    option.classList.add('correct');
                }
            });
            
            this.speechBubble.textContent = `Not quite! Let's count together: there are ${this.currentCount} ${this.currentObject.name}. Try counting them one by one!`;
            
            // Make objects pulse one by one to help counting
            const objects = document.querySelectorAll('.count-object');
            objects.forEach((obj, index) => {
                setTimeout(() => {
                    obj.classList.add('counted');
                    setTimeout(() => {
                        obj.classList.remove('counted');
                    }, 800);
                }, index * 300);
            });
        }
        
        this.updateDisplay();
        
        // Show next button or end game
        if (this.totalQuestions < this.maxQuestions) {
            setTimeout(() => {
                this.nextBtn.style.display = 'inline-block';
            }, 2000);
        } else {
            setTimeout(() => {
                this.endGame();
            }, 3000);
        }
        
        // Level up every 3 questions
        if (this.totalQuestions % 3 === 0 && this.totalQuestions > 0) {
            this.level++;
        }
    }
    
    nextQuestion() {
        // Re-enable all options
        const allOptions = document.querySelectorAll('.number-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.classList.remove('correct', 'wrong');
        });
        
        this.generateQuestion();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('correct').textContent = this.correctAnswers;
    }
    
    endGame() {
        const accuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalQuestions').textContent = this.totalQuestions;
        document.getElementById('accuracy').textContent = accuracy;
        
        document.getElementById('gameOverlay').style.display = 'flex';
    }
    
    restartGame() {
        this.score = 0;
        this.level = 1;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        
        document.getElementById('gameOverlay').style.display = 'none';
        
        // Re-enable all options
        const allOptions = document.querySelectorAll('.number-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.classList.remove('correct', 'wrong');
        });
        
        this.startNewGame();
    }
}

// Game instance
let countingGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    countingGame = new CountingGame();
});

// Control functions
function nextQuestion() {
    countingGame.nextQuestion();
}

function restartGame() {
    countingGame.restartGame();
}

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}
