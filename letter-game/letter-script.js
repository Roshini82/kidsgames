// Letter Matching Game Logic
class LetterMatchingGame {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.currentRound = [];
        this.matchedPairs = [];
        this.score = 0;
        this.streak = 0;
        this.roundSize = 4; // Start with 4 letters per round
        this.currentLetterIndex = 0;
        
        this.uppercaseGrid = document.getElementById('uppercaseGrid');
        this.lowercaseGrid = document.getElementById('lowercaseGrid');
        this.speechBubble = document.getElementById('speechBubble');
        this.nextBtn = document.getElementById('nextBtn');
        this.hintBtn = document.getElementById('hintBtn');
        
        this.draggedElement = null;
        this.currentPronunceLetter = null;
        
        this.encouragingMessages = [
            "Perfect match! 🎉",
            "Great job! ⭐",
            "Excellent! 👏",
            "Amazing! 🌟",
            "Wonderful! ✨",
            "Fantastic! 🎯",
            "Super! 🚀",
            "Brilliant! 💫"
        ];
        
        this.startNewRound();
    }
    
    startNewRound() {
        this.generateRound();
        this.updateDisplay();
        this.setupDragAndDrop();
    }
    
    generateRound() {
        // Select letters for this round
        this.currentRound = [];
        const startIndex = this.currentLetterIndex;
        
        for (let i = 0; i < this.roundSize && (startIndex + i) < this.alphabet.length; i++) {
            this.currentRound.push(this.alphabet[startIndex + i]);
        }
        
        // If we have fewer than roundSize letters left, fill with random previous letters
        while (this.currentRound.length < this.roundSize && this.currentLetterIndex > 0) {
            const randomIndex = Math.floor(Math.random() * this.currentLetterIndex);
            const randomLetter = this.alphabet[randomIndex];
            if (!this.currentRound.includes(randomLetter)) {
                this.currentRound.push(randomLetter);
            }
        }
        
        this.displayLetters();
        this.speechBubble.textContent = `Match each uppercase letter with its lowercase partner! Start with any letter you know.`;
        this.nextBtn.style.display = 'none';
    }
    
    displayLetters() {
        // Clear grids
        this.uppercaseGrid.innerHTML = '';
        this.lowercaseGrid.innerHTML = '';
        
        // Shuffle the arrays for random placement
        const shuffledUppercase = [...this.currentRound];
        const shuffledLowercase = [...this.currentRound];
        this.shuffleArray(shuffledUppercase);
        this.shuffleArray(shuffledLowercase);
        
        // Create uppercase letters
        shuffledUppercase.forEach(letter => {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter-card uppercase';
            letterDiv.textContent = letter;
            letterDiv.setAttribute('data-letter', letter);
            letterDiv.draggable = true;
            this.uppercaseGrid.appendChild(letterDiv);
        });
        
        // Create lowercase letters
        shuffledLowercase.forEach(letter => {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter-card lowercase';
            letterDiv.textContent = letter.toLowerCase();
            letterDiv.setAttribute('data-letter', letter);
            this.lowercaseGrid.appendChild(letterDiv);
        });
    }
    
    setupDragAndDrop() {
        // Add drag events to uppercase letters
        const uppercaseLetters = document.querySelectorAll('.uppercase');
        uppercaseLetters.forEach(letter => {
            letter.addEventListener('dragstart', (e) => this.handleDragStart(e));
            letter.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
        
        // Add drop events to lowercase letters
        const lowercaseLetters = document.querySelectorAll('.lowercase');
        lowercaseLetters.forEach(letter => {
            letter.addEventListener('dragover', (e) => this.handleDragOver(e));
            letter.addEventListener('drop', (e) => this.handleDrop(e));
            letter.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            letter.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }
    
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        this.currentPronunceLetter = e.target.getAttribute('data-letter');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }
    
    handleDragOver(e) {
        e.preventDefault();
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        if (!e.target.classList.contains('matched')) {
            e.target.classList.add('drop-zone');
        }
    }
    
    handleDragLeave(e) {
        e.target.classList.remove('drop-zone');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drop-zone');
        
        if (!this.draggedElement || e.target.classList.contains('matched')) return;
        
        const draggedLetter = this.draggedElement.getAttribute('data-letter');
        const targetLetter = e.target.getAttribute('data-letter');
        
        if (draggedLetter === targetLetter) {
            // Correct match
            this.handleCorrectMatch(this.draggedElement, e.target);
        } else {
            // Wrong match
            this.handleWrongMatch(this.draggedElement, e.target);
        }
    }
    
    handleCorrectMatch(uppercaseEl, lowercaseEl) {
        // Mark as matched
        uppercaseEl.classList.add('matched');
        lowercaseEl.classList.add('matched');
        
        // Disable dragging
        uppercaseEl.draggable = false;
        
        this.score += 10;
        this.streak++;
        
        // Bonus for streak
        if (this.streak >= 3) {
            this.score += 5;
        }
        
        this.matchedPairs.push(uppercaseEl.getAttribute('data-letter'));
        
        const message = this.encouragingMessages[Math.floor(Math.random() * this.encouragingMessages.length)];
        this.speechBubble.textContent = `${message} ${uppercaseEl.textContent} matches ${lowercaseEl.textContent}!`;
        
        // Pronounce the letter
        this.pronounceSpecificLetter(uppercaseEl.getAttribute('data-letter'));
        
        // Check if round is complete
        if (this.matchedPairs.length === this.currentRound.length) {
            setTimeout(() => {
                this.completeRound();
            }, 1500);
        }
        
        this.updateDisplay();
    }
    
    handleWrongMatch(uppercaseEl, lowercaseEl) {
        // Show wrong animation
        uppercaseEl.classList.add('wrong-match');
        lowercaseEl.classList.add('wrong-match');
        
        this.streak = 0;
        this.speechBubble.textContent = `Not quite! ${uppercaseEl.textContent} doesn't match ${lowercaseEl.textContent}. Try again!`;
        
        // Remove wrong animation after delay
        setTimeout(() => {
            uppercaseEl.classList.remove('wrong-match');
            lowercaseEl.classList.remove('wrong-match');
        }, 1000);
        
        this.updateDisplay();
    }
    
    completeRound() {
        this.currentLetterIndex += this.roundSize;
        
        if (this.currentLetterIndex >= this.alphabet.length) {
            // Game complete
            this.endGame();
        } else {
            this.speechBubble.textContent = `Amazing! You matched all the letters! Ready for the next round?`;
            this.nextBtn.style.display = 'inline-block';
        }
    }
    
    nextRound() {
        this.matchedPairs = [];
        
        // Increase difficulty gradually
        if (this.currentLetterIndex % 8 === 0 && this.roundSize < 6) {
            this.roundSize++;
        }
        
        this.startNewRound();
    }
    
    showHint() {
        // Find an unmatched uppercase letter
        const unmatchedUppercase = document.querySelector('.uppercase:not(.matched)');
        if (!unmatchedUppercase) return;
        
        const letter = unmatchedUppercase.getAttribute('data-letter');
        const lowercaseLetter = document.querySelector(`.lowercase[data-letter="${letter}"]`);
        
        // Highlight both letters briefly
        unmatchedUppercase.style.background = 'linear-gradient(135deg, #fdcb6e, #e17055)';
        lowercaseLetter.style.background = 'linear-gradient(135deg, #fdcb6e, #e17055)';
        
        this.speechBubble.textContent = `Hint: The uppercase ${letter} matches with lowercase ${letter.toLowerCase()}!`;
        
        setTimeout(() => {
            unmatchedUppercase.style.background = '';
            lowercaseLetter.style.background = '';
        }, 2000);
        
        // Reduce score slightly for using hint
        this.score = Math.max(0, this.score - 2);
        this.updateDisplay();
    }
    
    pronounceLetter() {
        if (this.currentPronunceLetter) {
            this.pronounceSpecificLetter(this.currentPronunceLetter);
        } else {
            // Pronounce a random letter from current round
            const randomLetter = this.currentRound[Math.floor(Math.random() * this.currentRound.length)];
            this.pronounceSpecificLetter(randomLetter);
        }
    }
    
    pronounceSpecificLetter(letter) {
        const utterance = new SpeechSynthesisUtterance(`The letter ${letter}`);
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
        
        // Also pronounce the letter sound
        setTimeout(() => {
            const soundUtterance = new SpeechSynthesisUtterance(this.getLetterSound(letter));
            soundUtterance.rate = 0.8;
            soundUtterance.pitch = 1.3;
            speechSynthesis.speak(soundUtterance);
        }, 1500);
    }
    
    getLetterSound(letter) {
        const sounds = {
            'A': 'ay', 'B': 'bee', 'C': 'see', 'D': 'dee', 'E': 'ee',
            'F': 'eff', 'G': 'gee', 'H': 'aych', 'I': 'eye', 'J': 'jay',
            'K': 'kay', 'L': 'ell', 'M': 'em', 'N': 'en', 'O': 'oh',
            'P': 'pee', 'Q': 'cue', 'R': 'ar', 'S': 'ess', 'T': 'tee',
            'U': 'you', 'V': 'vee', 'W': 'double you', 'X': 'ex', 'Y': 'why', 'Z': 'zee'
        };
        return sounds[letter] || letter;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('progress').textContent = this.matchedPairs.length + (this.currentLetterIndex);
        document.getElementById('streak').textContent = this.streak;
    }
    
    endGame() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLetters').textContent = this.alphabet.length;
        document.getElementById('gameOverlay').style.display = 'flex';
    }
    
    restartGame() {
        this.currentLetterIndex = 0;
        this.matchedPairs = [];
        this.score = 0;
        this.streak = 0;
        this.roundSize = 4;
        
        document.getElementById('gameOverlay').style.display = 'none';
        this.startNewRound();
    }
}

// Game instance
let letterGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    letterGame = new LetterMatchingGame();
});

// Control functions
function nextRound() {
    letterGame.nextRound();
}

function showHint() {
    letterGame.showHint();
}

function pronounceLetter() {
    letterGame.pronounceLetter();
}

function restartGame() {
    letterGame.restartGame();
}

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}
