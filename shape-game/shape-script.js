// Shape Puzzle Game Logic
class ShapeGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.shapesFound = 0;
        this.shapesLearned = 3;
        this.streak = 0;
        this.targetShape = null;
        this.targetShapes = [];
        this.foundCount = 0;
        this.totalCount = 0;
        
        this.shapes = [
            { name: 'CIRCLES', class: 'circle', count: 0 },
            { name: 'SQUARES', class: 'square', count: 0 },
            { name: 'TRIANGLES', class: 'triangle', count: 0 },
            { name: 'RECTANGLES', class: 'rectangle', count: 0 },
            { name: 'DIAMONDS', class: 'diamond', count: 0 },
            { name: 'STARS', class: 'star', count: 0 }
        ];
        
        this.currentShapes = this.shapes.slice(0, 3); // Start with 3 shapes
        
        this.encouragements = [
            "Great find! 🎯",
            "Perfect! ⭐",
            "You found it! 🔥",
            "Excellent! 💫",
            "Amazing! 🚀",
            "Shape master! 👑",
            "Fantastic! 🎉"
        ];
        
        this.wrongMessages = [
            "That's not the shape we're looking for! 🤔",
            "Try again! Look carefully! 👀",
            "Not quite! Keep looking! 💪",
            "Close! Try another one! 😊",
            "Look for the target shape! 📐"
        ];
        
        this.generateShapeChallenge();
        this.updateDisplay();
    }
    
    generateShapeChallenge() {
        // Select target shape for this round
        this.targetShape = this.currentShapes[Math.floor(Math.random() * this.currentShapes.length)];
        
        // Update UI to show target shape
        document.getElementById('shapeName').textContent = this.targetShape.name;
        const shapeExample = document.getElementById('shapeExample');
        shapeExample.className = `shape-example ${this.targetShape.class}`;
        
        // Generate grid of shapes
        this.generateShapesGrid();
        
        // Update speech bubble and instructions
        this.updateSpeechBubble();
        this.updateInstructions();
    }
    
    generateShapesGrid() {
        const grid = document.getElementById('shapesGrid');
        grid.innerHTML = '';
        
        // Calculate grid size based on level
        const gridSize = Math.min(12 + (this.level * 2), 20);
        
        // Calculate how many target shapes to include (25-40% of grid)
        const targetCount = Math.floor(gridSize * (0.25 + (this.level * 0.05)));
        const otherCount = gridSize - targetCount;
        
        this.totalCount = targetCount;
        this.foundCount = 0;
        this.targetShapes = [];
        
        // Create array of shapes to place
        const shapesToPlace = [];
        
        // Add target shapes
        for (let i = 0; i < targetCount; i++) {
            shapesToPlace.push(this.targetShape.class);
        }
        
        // Add other shapes
        const otherShapes = this.currentShapes.filter(shape => shape.class !== this.targetShape.class);
        for (let i = 0; i < otherCount; i++) {
            const randomShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
            shapesToPlace.push(randomShape.class);
        }
        
        // Shuffle array
        for (let i = shapesToPlace.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shapesToPlace[i], shapesToPlace[j]] = [shapesToPlace[j], shapesToPlace[i]];
        }
        
        // Create shape elements
        shapesToPlace.forEach((shapeClass, index) => {
            const shapeElement = document.createElement('div');
            shapeElement.className = `game-shape ${shapeClass}`;
            shapeElement.addEventListener('click', () => this.clickShape(shapeElement, shapeClass));
            
            // Track target shapes
            if (shapeClass === this.targetShape.class) {
                this.targetShapes.push(shapeElement);
            }
            
            grid.appendChild(shapeElement);
        });
        
        // Update progress
        this.updateProgress();
    }
    
    clickShape(element, shapeClass) {
        const feedback = document.getElementById('feedback');
        const speechBubble = document.getElementById('speechBubble');
        
        if (shapeClass === this.targetShape.class && !element.classList.contains('found')) {
            // Correct shape found
            element.classList.add('found');
            this.foundCount++;
            this.shapesFound++;
            this.streak++;
            this.score += 10 + (this.level * 5);
            
            const encouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
            feedback.textContent = encouragement;
            feedback.className = 'feedback correct';
            speechBubble.textContent = `Yes! That's a ${this.targetShape.name.slice(0, -1).toLowerCase()}!`;
            
            this.updateProgress();
            
            // Check if all target shapes found
            if (this.foundCount >= this.totalCount) {
                setTimeout(() => {
                    if (this.level < 6) {
                        this.showLevelComplete();
                    } else {
                        this.generateShapeChallenge();
                    }
                }, 1500);
            }
            
        } else if (element.classList.contains('found')) {
            // Already found this shape
            feedback.textContent = "You already found that one! 👍";
            feedback.className = 'feedback';
            
        } else {
            // Wrong shape
            element.classList.add('wrong');
            this.streak = 0;
            
            const wrongMessage = this.wrongMessages[Math.floor(Math.random() * this.wrongMessages.length)];
            feedback.textContent = wrongMessage;
            feedback.className = 'feedback wrong';
            speechBubble.textContent = `Look for ${this.targetShape.name.toLowerCase()}, not that shape!`;
            
            // Remove wrong class after animation
            setTimeout(() => {
                element.classList.remove('wrong');
            }, 600);
        }
        
        this.updateDisplay();
        
        // Clear feedback after delay
        setTimeout(() => {
            if (feedback.className !== 'feedback correct' || this.foundCount >= this.totalCount) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
        }, 2000);
    }
    
    updateProgress() {
        document.getElementById('found').textContent = this.foundCount;
        document.getElementById('total').textContent = this.totalCount;
        
        const progressPercent = this.totalCount > 0 ? (this.foundCount / this.totalCount) * 100 : 0;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
    }
    
    showLevelComplete() {
        document.getElementById('levelComplete').style.display = 'flex';
    }
    
    nextLevel() {
        this.level++;
        
        // Add more shapes as level increases
        if (this.level <= 2) {
            this.currentShapes = this.shapes.slice(0, 3);
            this.shapesLearned = 3;
        } else if (this.level <= 4) {
            this.currentShapes = this.shapes.slice(0, 4);
            this.shapesLearned = 4;
        } else if (this.level <= 6) {
            this.currentShapes = this.shapes.slice(0, 5);
            this.shapesLearned = 5;
        } else {
            this.currentShapes = this.shapes.slice(0, 6);
            this.shapesLearned = 6;
        }
        
        document.getElementById('levelComplete').style.display = 'none';
        
        // Clear feedback
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        this.generateShapeChallenge();
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('shapesFound').textContent = this.shapesFound;
        document.getElementById('shapesLearned').textContent = this.shapesLearned;
        document.getElementById('streak').textContent = this.streak;
    }
    
    updateSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        
        const messages = [
            `Find all the ${this.targetShape.name.toLowerCase()}! 🔍`,
            `Look carefully for ${this.targetShape.name.toLowerCase()}! 👀`,
            `Can you spot all the ${this.targetShape.name.toLowerCase()}?`,
            `Click on every ${this.targetShape.name.slice(0, -1).toLowerCase()} you see!`,
            `Hunt for ${this.targetShape.name.toLowerCase()}! 🎯`
        ];
        
        if (this.foundCount === 0) {
            speechBubble.textContent = `Level ${this.level} - Let's find shapes!`;
        } else {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            speechBubble.textContent = randomMessage;
        }
    }
    
    updateInstructions() {
        const instructions = document.getElementById('instructions');
        instructions.textContent = `Click on all the ${this.targetShape.name} you can find!`;
    }
}

// Initialize game when page loads
let shapeGame;

document.addEventListener('DOMContentLoaded', function() {
    shapeGame = new ShapeGame();
});

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}

function nextLevel() {
    shapeGame.nextLevel();
}
