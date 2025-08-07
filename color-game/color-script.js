// Color Match Game Logic
class ColorGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.matches = 0;
        this.colorsLearned = 0;
        this.streak = 0;
        this.matchesInLevel = 5;
        this.currentMatches = 0;
        
        this.colors = [
            { name: 'RED', class: 'red' },
            { name: 'BLUE', class: 'blue' },
            { name: 'GREEN', class: 'green' },
            { name: 'YELLOW', class: 'yellow' },
            { name: 'ORANGE', class: 'orange' },
            { name: 'PURPLE', class: 'purple' },
            { name: 'PINK', class: 'pink' },
            { name: 'BROWN', class: 'brown' }
        ];
        
        this.currentColors = this.colors.slice(0, 4); // Start with 4 colors
        this.currentColor = null;
        
        this.encouragements = [
            "Perfect match! 🌈",
            "Great job! 🎨",
            "You're learning colors! ⭐",
            "Fantastic! 🎉",
            "Keep it up! 🚀",
            "Color master! 👑",
            "Amazing work! 💫"
        ];
        
        this.wrongMessages = [
            "Try again! 🤔",
            "Not quite! Keep trying! 💪",
            "Look at the colors carefully! 👀",
            "You can do it! 😊",
            "Practice makes perfect! 📚"
        ];
        
        this.setupDragAndDrop();
        this.generateColorChallenge();
        this.updateDisplay();
    }
    
    setupDragAndDrop() {
        const draggableColor = document.getElementById('draggableColor');
        const dropZones = document.querySelectorAll('.drop-zone');
        
        // Drag events for the draggable color
        draggableColor.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', this.currentColor.class);
            draggableColor.classList.add('dragging');
        });
        
        draggableColor.addEventListener('dragend', () => {
            draggableColor.classList.remove('dragging');
        });
        
        // Drop events for drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const draggedColor = e.dataTransfer.getData('text/plain');
                const targetColor = zone.getAttribute('data-color');
                
                this.checkMatch(zone, draggedColor, targetColor);
            });
        });
        
        // Touch events for mobile support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const draggableColor = document.getElementById('draggableColor');
        const dropZones = document.querySelectorAll('.drop-zone');
        
        let isDragging = false;
        let dragElement = null;
        
        draggableColor.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            dragElement = draggableColor;
            draggableColor.classList.add('dragging');
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Remove all drag-over classes
            dropZones.forEach(zone => zone.classList.remove('drag-over'));
            
            // Add drag-over to current zone
            const dropZone = elementBelow?.closest('.drop-zone');
            if (dropZone) {
                dropZone.classList.add('drag-over');
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone) {
                const targetColor = dropZone.getAttribute('data-color');
                this.checkMatch(dropZone, this.currentColor.class, targetColor);
            }
            
            // Cleanup
            isDragging = false;
            dragElement = null;
            draggableColor.classList.remove('dragging');
            dropZones.forEach(zone => zone.classList.remove('drag-over'));
        });
    }
    
    generateColorChallenge() {
        // Select a random color from current level colors
        this.currentColor = this.currentColors[Math.floor(Math.random() * this.currentColors.length)];
        
        // Update the draggable color
        const draggableColor = document.getElementById('draggableColor');
        const colorLabel = document.getElementById('colorLabel');
        
        draggableColor.className = `draggable-color ${this.currentColor.class}`;
        colorLabel.textContent = this.currentColor.name;
        
        // Update drop zones based on level
        this.updateDropZones();
        
        // Update speech bubble
        this.updateSpeechBubble();
    }
    
    updateDropZones() {
        const dropZones = document.getElementById('dropZones');
        dropZones.innerHTML = '';
        
        // Create zones for current level colors
        this.currentColors.forEach(color => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.setAttribute('data-color', color.class);
            zone.innerHTML = `
                <span class="zone-label">${color.name}</span>
                <div class="zone-preview ${color.class}"></div>
            `;
            dropZones.appendChild(zone);
        });
        
        // Re-setup drag and drop for new zones
        this.setupDragAndDrop();
    }
    
    checkMatch(zone, draggedColor, targetColor) {
        const feedback = document.getElementById('feedback');
        const speechBubble = document.getElementById('speechBubble');
        
        if (draggedColor === targetColor) {
            // Correct match
            zone.classList.add('correct');
            this.matches++;
            this.currentMatches++;
            this.streak++;
            this.score += 10 + (this.level * 5);
            
            const encouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
            feedback.textContent = encouragement;
            feedback.className = 'feedback correct';
            speechBubble.textContent = `Yes! ${this.currentColor.name} matches!`;
            
            // Track unique colors learned
            const colorName = this.currentColor.name;
            if (!window.learnedColors) window.learnedColors = new Set();
            if (!window.learnedColors.has(colorName)) {
                window.learnedColors.add(colorName);
                this.colorsLearned++;
            }
            
        } else {
            // Wrong match
            zone.classList.add('wrong');
            this.streak = 0;
            
            const wrongMessage = this.wrongMessages[Math.floor(Math.random() * this.wrongMessages.length)];
            feedback.textContent = wrongMessage;
            feedback.className = 'feedback wrong';
            speechBubble.textContent = `${this.currentColor.name} goes in the ${this.currentColor.name} zone!`;
        }
        
        this.updateDisplay();
        
        // Check if level is complete
        if (this.currentMatches >= this.matchesInLevel) {
            setTimeout(() => this.showLevelComplete(), 2000);
        } else {
            // Next challenge after delay
            setTimeout(() => {
                this.generateColorChallenge();
                feedback.textContent = '';
                feedback.className = 'feedback';
                
                // Remove visual feedback from zones
                document.querySelectorAll('.drop-zone').forEach(z => {
                    z.classList.remove('correct', 'wrong');
                });
            }, 2500);
        }
    }
    
    showLevelComplete() {
        document.getElementById('levelComplete').style.display = 'flex';
    }
    
    nextLevel() {
        this.level++;
        this.currentMatches = 0;
        this.matchesInLevel = Math.min(5 + this.level, 8); // Increase matches per level
        
        // Add more colors as level increases
        if (this.level <= 2) {
            this.currentColors = this.colors.slice(0, 4);
        } else if (this.level <= 4) {
            this.currentColors = this.colors.slice(0, 6);
        } else {
            this.currentColors = this.colors.slice(0, 8);
        }
        
        document.getElementById('levelComplete').style.display = 'none';
        
        // Clear feedback
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        // Remove visual feedback from zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('correct', 'wrong');
        });
        
        this.generateColorChallenge();
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('matches').textContent = this.matches;
        document.getElementById('colorsLearned').textContent = this.colorsLearned;
        document.getElementById('streak').textContent = this.streak;
    }
    
    updateSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        const instructions = document.getElementById('instructions');
        
        const messages = [
            `Drag the ${this.currentColor.name} circle to the ${this.currentColor.name} zone!`,
            `Where does ${this.currentColor.name} belong?`,
            `Can you match ${this.currentColor.name}?`,
            `Find the ${this.currentColor.name} zone!`,
            `Match the color to its name!`
        ];
        
        if (this.currentMatches === 0) {
            speechBubble.textContent = `Level ${this.level} - Let's learn colors!`;
            instructions.textContent = `Drag the ${this.currentColor.name} circle to match its name!`;
        } else {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            speechBubble.textContent = randomMessage;
            instructions.textContent = `Drag the ${this.currentColor.name} circle to match its name!`;
        }
    }
}

// Initialize game when page loads
let colorGame;

document.addEventListener('DOMContentLoaded', function() {
    colorGame = new ColorGame();
});

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}

function nextLevel() {
    colorGame.nextLevel();
}
