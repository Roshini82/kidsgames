// Animal Sound Game Logic
class AnimalSoundGame {
    constructor() {
        this.animals = [
            { name: 'Cow', emoji: '🐄', sound: 'moo' },
            { name: 'Dog', emoji: '🐶', sound: 'woof' },
            { name: 'Cat', emoji: '🐱', sound: 'meow' },
            { name: 'Pig', emoji: '🐷', sound: 'oink' },
            { name: 'Sheep', emoji: '🐑', sound: 'baa' },
            { name: 'Duck', emoji: '🦆', sound: 'quack' },
            { name: 'Horse', emoji: '🐴', sound: 'neigh' },
            { name: 'Rooster', emoji: '🐓', sound: 'cock-a-doodle-doo' },
            { name: 'Lion', emoji: '🦁', sound: 'roar' },
            { name: 'Elephant', emoji: '🐘', sound: 'trumpet' }
        ];
        
        this.currentAnimal = null;
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.questionsAnswered = 0;
        this.maxQuestions = 10;
        
        this.speechBubble = document.getElementById('speechBubble');
        this.soundWaves = document.getElementById('soundWaves');
        this.animalsGrid = document.getElementById('animalsGrid');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.encouragingMessages = [
            "Great job! 🎉",
            "Awesome! 🌟",
            "Perfect! ✨",
            "Amazing! 🎯",
            "Wonderful! 🎊",
            "Excellent! 👏",
            "Fantastic! 🌈",
            "Super! ⭐"
        ];
        
        this.startNewGame();
    }
    
    startNewGame() {
        this.generateQuestion();
        this.updateDisplay();
    }
    
    generateQuestion() {
        // Select a random animal
        this.currentAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
        
        // Create options (correct answer + 3 random wrong answers)
        const options = [this.currentAnimal];
        while (options.length < 4) {
            const randomAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
            if (!options.find(option => option.name === randomAnimal.name)) {
                options.push(randomAnimal);
            }
        }
        
        // Shuffle options
        this.shuffleArray(options);
        
        // Display options
        this.displayAnimalOptions(options);
        
        // Update speech bubble
        this.speechBubble.textContent = `Listen carefully! Which animal makes this sound: "${this.currentAnimal.sound}"?`;
        
        // Hide next button
        this.nextBtn.style.display = 'none';
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    displayAnimalOptions(options) {
        this.animalsGrid.innerHTML = '';
        
        options.forEach(animal => {
            const animalDiv = document.createElement('div');
            animalDiv.className = 'animal-option';
            animalDiv.innerHTML = `
                <span class="animal-emoji">${animal.emoji}</span>
                <span class="animal-name">${animal.name}</span>
            `;
            
            animalDiv.addEventListener('click', () => this.selectAnimal(animal, animalDiv));
            this.animalsGrid.appendChild(animalDiv);
        });
    }
    
    selectAnimal(selectedAnimal, animalElement) {
        // Disable all options
        const allOptions = document.querySelectorAll('.animal-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        if (selectedAnimal.name === this.currentAnimal.name) {
            // Correct answer
            animalElement.classList.add('correct');
            this.score += 10;
            this.streak++;
            
            // Bonus points for streak
            if (this.streak >= 3) {
                this.score += 5;
            }
            
            const message = this.encouragingMessages[Math.floor(Math.random() * this.encouragingMessages.length)];
            this.speechBubble.textContent = `${message} The ${selectedAnimal.name} says "${selectedAnimal.sound}"!`;
            
        } else {
            // Wrong answer
            animalElement.classList.add('wrong');
            this.streak = 0;
            
            // Highlight correct answer
            allOptions.forEach(option => {
                const animalName = option.querySelector('.animal-name').textContent;
                if (animalName === this.currentAnimal.name) {
                    option.classList.add('correct');
                }
            });
            
            this.speechBubble.textContent = `Oops! The correct answer is ${this.currentAnimal.name}. A ${this.currentAnimal.name} says "${this.currentAnimal.sound}".`;
        }
        
        this.questionsAnswered++;
        this.updateDisplay();
        
        // Show next button or end game
        if (this.questionsAnswered < this.maxQuestions) {
            setTimeout(() => {
                this.nextBtn.style.display = 'inline-block';
            }, 1500);
        } else {
            setTimeout(() => {
                this.endGame();
            }, 2000);
        }
        
        // Level up every 3 questions
        if (this.questionsAnswered % 3 === 0 && this.questionsAnswered > 0) {
            this.level++;
        }
    }
    
    playCurrentSound() {
        if (!this.currentAnimal) return;
        
        // Show sound waves animation
        this.soundWaves.classList.add('active');
        
        // Create speech synthesis
        const utterance = new SpeechSynthesisUtterance(this.currentAnimal.sound);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        
        utterance.onend = () => {
            this.soundWaves.classList.remove('active');
        };
        
        // Speak the animal sound
        speechSynthesis.speak(utterance);
        
        // Hide sound waves after 2 seconds as backup
        setTimeout(() => {
            this.soundWaves.classList.remove('active');
        }, 2000);
    }
    
    nextQuestion() {
        // Re-enable all options
        const allOptions = document.querySelectorAll('.animal-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.classList.remove('correct', 'wrong');
        });
        
        this.generateQuestion();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('streak').textContent = this.streak;
    }
    
    endGame() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalAnimalsCount').textContent = this.questionsAnswered;
        document.getElementById('gameOverlay').style.display = 'flex';
    }
    
    restartGame() {
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.questionsAnswered = 0;
        
        document.getElementById('gameOverlay').style.display = 'none';
        
        // Re-enable all options
        const allOptions = document.querySelectorAll('.animal-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.classList.remove('correct', 'wrong');
        });
        
        this.startNewGame();
    }
}

// Game instance
let animalGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    animalGame = new AnimalSoundGame();
});

// Control functions
function playCurrentSound() {
    animalGame.playCurrentSound();
}

function nextQuestion() {
    animalGame.nextQuestion();
}

function restartGame() {
    animalGame.restartGame();
}

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}
