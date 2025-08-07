class SpellingGame {
    constructor() {
        this.currentWordIndex = 0;
        this.score = 0;
        this.selectedBoxIndex = -1;
        this.userAnswer = [];
        
        // Game words with emoji-based images
        this.words = [
            {
                word: "BUS",
                emoji: "🚌",
                hint: "A vehicle that carries many people"
            },
            {
                word: "CAT",
                emoji: "🐱",
                hint: "A furry pet that says meow"
            },
            {
                word: "DOG",
                emoji: "🐕",
                hint: "Man's best friend"
            },
            {
                word: "SUN",
                emoji: "☀️",
                hint: "Bright star in the sky"
            },
            {
                word: "TREE",
                emoji: "🌳",
                hint: "Tall plant with leaves"
            },
            {
                word: "FISH",
                emoji: "🐟",
                hint: "Lives in water"
            },
            {
                word: "BIRD",
                emoji: "🐦",
                hint: "Can fly in the sky"
            },
            {
                word: "HOUSE",
                emoji: "🏠",
                hint: "Where people live"
            }
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadCurrentWord();
        this.setupEventListeners();
        this.updateScore();
    }
    
    loadCurrentWord() {
        const currentWord = this.words[this.currentWordIndex];
        const guessImage = document.getElementById('guessImage');
        const answerBoxes = document.getElementById('answerBoxes');
        const letterButtons = document.getElementById('letterButtons');
        const nextButton = document.getElementById('nextButton');
        const imageContainer = document.querySelector('.image-container');
        
        // Create emoji display and hint
        imageContainer.innerHTML = `
            <div class="emoji-display">${currentWord.emoji}</div>
            <div class="hint-text">Guess this word: ${currentWord.hint}</div>
        `;
        
        // Reset user answer
        this.userAnswer = new Array(currentWord.word.length).fill('');
        this.selectedBoxIndex = -1;
        
        // Create answer boxes
        answerBoxes.innerHTML = '';
        for (let i = 0; i < currentWord.word.length; i++) {
            const box = document.createElement('div');
            box.className = 'answer-box';
            box.dataset.index = i;
            box.addEventListener('click', () => this.selectBox(i));
            answerBoxes.appendChild(box);
        }
        
        // Generate letter buttons
        this.generateLetterButtons();
        
        // Hide next button
        nextButton.style.display = 'none';
    }
    
    generateLetterButtons() {
        const currentWord = this.words[this.currentWordIndex].word;
        const letterButtons = document.getElementById('letterButtons');
        
        // Get correct letters
        const correctLetters = [...currentWord];
        
        // Add some random letters for difficulty
        const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = [];
        
        // Add 4-6 random letters that aren't in the word
        const numRandomLetters = Math.min(6, Math.max(4, 8 - correctLetters.length));
        while (randomLetters.length < numRandomLetters) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if (!correctLetters.includes(randomLetter) && !randomLetters.includes(randomLetter)) {
                randomLetters.push(randomLetter);
            }
        }
        
        // Combine and shuffle letters
        const allGameLetters = [...correctLetters, ...randomLetters];
        this.shuffleArray(allGameLetters);
        
        // Create letter buttons
        letterButtons.innerHTML = '';
        allGameLetters.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.addEventListener('click', () => this.selectLetter(letter, button));
            letterButtons.appendChild(button);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    selectBox(index) {
        // Remove previous selection
        document.querySelectorAll('.answer-box').forEach(box => {
            box.style.border = '3px dashed #2196f3';
            box.style.background = 'white';
        });
        
        // Select new box
        this.selectedBoxIndex = index;
        const selectedBox = document.querySelector(`[data-index="${index}"]`);
        selectedBox.style.border = '3px solid #ff9800';
        selectedBox.style.background = '#fff3e0';
    }
    
    selectLetter(letter, button) {
        if (this.selectedBoxIndex === -1) {
            // If no box selected, select the first empty box
            for (let i = 0; i < this.userAnswer.length; i++) {
                if (this.userAnswer[i] === '') {
                    this.selectBox(i);
                    break;
                }
            }
        }
        
        if (this.selectedBoxIndex !== -1) {
            // Place letter in selected box
            this.userAnswer[this.selectedBoxIndex] = letter;
            const selectedBox = document.querySelector(`[data-index="${this.selectedBoxIndex}"]`);
            selectedBox.textContent = letter;
            selectedBox.classList.add('filled');
            
            // Disable the button
            button.disabled = true;
            
            // Move to next empty box
            let nextEmptyIndex = -1;
            for (let i = this.selectedBoxIndex + 1; i < this.userAnswer.length; i++) {
                if (this.userAnswer[i] === '') {
                    nextEmptyIndex = i;
                    break;
                }
            }
            
            if (nextEmptyIndex !== -1) {
                this.selectBox(nextEmptyIndex);
            } else {
                this.selectedBoxIndex = -1;
                document.querySelectorAll('.answer-box').forEach(box => {
                    box.style.border = '3px dashed #2196f3';
                    box.style.background = 'white';
                });
            }
            
            // Check if word is complete
            this.checkAnswer();
        }
    }
    
    checkAnswer() {
        const currentWord = this.words[this.currentWordIndex].word;
        const userWord = this.userAnswer.join('');
        
        if (userWord.length === currentWord.length) {
            const boxes = document.querySelectorAll('.answer-box');
            
            if (userWord === currentWord) {
                // Correct answer
                boxes.forEach(box => {
                    box.classList.add('correct');
                    box.style.border = '3px solid #4caf50';
                    box.style.background = '#c8e6c9';
                });
                
                this.score += 10;
                this.updateScore();
                
                // Show next button
                setTimeout(() => {
                    document.getElementById('nextButton').style.display = 'block';
                }, 500);
                
                // Disable all letter buttons
                document.querySelectorAll('.letter-btn').forEach(btn => {
                    btn.disabled = true;
                });
                
            } else {
                // Wrong answer
                boxes.forEach(box => {
                    box.classList.add('wrong');
                });
                
                // Reset after animation
                setTimeout(() => {
                    this.resetCurrentAttempt();
                }, 1000);
            }
        }
    }
    
    resetCurrentAttempt() {
        // Clear user answer
        this.userAnswer = new Array(this.words[this.currentWordIndex].word.length).fill('');
        this.selectedBoxIndex = -1;
        
        // Reset boxes
        const boxes = document.querySelectorAll('.answer-box');
        boxes.forEach(box => {
            box.textContent = '';
            box.className = 'answer-box';
            box.style.border = '3px dashed #2196f3';
            box.style.background = 'white';
        });
        
        // Re-enable all letter buttons
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    nextWord() {
        this.currentWordIndex++;
        
        if (this.currentWordIndex >= this.words.length) {
            this.gameComplete();
        } else {
            this.loadCurrentWord();
        }
    }
    
    gameComplete() {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="color: #4caf50; margin-bottom: 20px;">🎉 Congratulations! 🎉</h1>
                <p style="font-size: 24px; margin-bottom: 20px;">You completed all the words!</p>
                <p style="font-size: 20px; color: #666; margin-bottom: 30px;">Final Score: ${this.score} points</p>
                <button onclick="location.reload()" style="
                    background: #2196f3; 
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 10px; 
                    font-size: 18px; 
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
                ">Play Again</button>
            </div>
        `;
    }
    
    updateScore() {
        document.getElementById('scoreDisplay').textContent = `Score: ${this.score}`;
    }
    
    setupEventListeners() {
        document.getElementById('nextButton').addEventListener('click', () => {
            this.nextWord();
        });
        
        // Allow clicking on boxes to clear them
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-box') && e.target.classList.contains('filled')) {
                const index = parseInt(e.target.dataset.index);
                const letter = this.userAnswer[index];
                
                // Clear the box
                this.userAnswer[index] = '';
                e.target.textContent = '';
                e.target.classList.remove('filled');
                e.target.style.border = '3px dashed #2196f3';
                e.target.style.background = 'white';
                
                // Re-enable the corresponding letter button
                document.querySelectorAll('.letter-btn').forEach(btn => {
                    if (btn.dataset.letter === letter && btn.disabled) {
                        btn.disabled = false;
                        return;
                    }
                });
            }
        });
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpellingGame();
});
