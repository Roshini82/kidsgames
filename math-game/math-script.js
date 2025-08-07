// Math Quiz Game Logic
class MathGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.correct = 0;
        this.wrong = 0;
        this.streak = 0;
        this.currentAnswer = 0;
        this.questionsInLevel = 5;
        this.questionsAnswered = 0;
        
        this.encouragements = [
            "Great job! 🌟",
            "Awesome! 🎉",
            "Fantastic! ⭐",
            "You're a math star! 🌟",
            "Keep it up! 🚀",
            "Brilliant! 💫",
            "Amazing work! 🎊"
        ];
        
        this.wrongMessages = [
            "Not quite! Try again! 🤔",
            "Close! Keep trying! 💪",
            "Don't give up! 🦉",
            "Let's try another one! 😊",
            "Practice makes perfect! 📚"
        ];
        
        this.generateProblem();
        this.updateDisplay();
    }
    
    generateProblem() {
        let num1, num2, operator, answer;
        
        // Adjust difficulty based on level
        const maxNum = Math.min(5 + (this.level * 2), 20);
        
        if (this.level <= 2) {
            // Addition only for first 2 levels
            operator = '+';
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            answer = num1 + num2;
        } else if (this.level <= 4) {
            // Addition and easy subtraction
            if (Math.random() < 0.6) {
                operator = '+';
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
            } else {
                operator = '-';
                answer = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * answer) + 1;
                num1 = answer + num2;
                answer = num1 - num2;
            }
        } else {
            // Mixed operations
            const operations = ['+', '-'];
            operator = operations[Math.floor(Math.random() * operations.length)];
            
            if (operator === '+') {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
            } else {
                answer = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * answer) + 1;
                num1 = answer + num2;
                answer = num1 - num2;
            }
        }
        
        this.currentAnswer = answer;
        
        // Update problem display
        document.getElementById('num1').textContent = num1;
        document.getElementById('operator').textContent = operator;
        document.getElementById('num2').textContent = num2;
        document.getElementById('answerDisplay').textContent = '?';
        
        // Generate answer options
        this.generateAnswerOptions(answer);
        
        // Update speech bubble
        this.updateSpeechBubble();
    }
    
    generateAnswerOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // Generate 3 wrong answers
        while (options.length < 4) {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 5) + 1;
            } else {
                wrongAnswer = Math.max(0, correctAnswer - Math.floor(Math.random() * 5) - 1);
            }
            
            if (!options.includes(wrongAnswer) && wrongAnswer >= 0) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        // Update buttons
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.textContent = options[index];
            btn.onclick = () => this.selectAnswer(btn, options[index]);
            btn.className = 'answer-btn';
            btn.disabled = false;
        });
    }
    
    selectAnswer(button, selectedAnswer) {
        const buttons = document.querySelectorAll('.answer-btn');
        const feedback = document.getElementById('feedback');
        const speechBubble = document.getElementById('speechBubble');
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        
        if (selectedAnswer === this.currentAnswer) {
            // Correct answer
            button.classList.add('correct');
            this.correct++;
            this.streak++;
            this.score += 10 + (this.level * 5);
            
            const encouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
            feedback.textContent = encouragement;
            feedback.className = 'feedback correct';
            speechBubble.textContent = "Perfect! You got it right!";
            
            // Show correct answer
            document.getElementById('answerDisplay').textContent = this.currentAnswer;
            
        } else {
            // Wrong answer
            button.classList.add('wrong');
            this.wrong++;
            this.streak = 0;
            
            const wrongMessage = this.wrongMessages[Math.floor(Math.random() * this.wrongMessages.length)];
            feedback.textContent = wrongMessage;
            feedback.className = 'feedback wrong';
            speechBubble.textContent = `The correct answer is ${this.currentAnswer}`;
            
            // Highlight correct answer
            buttons.forEach(btn => {
                if (parseInt(btn.textContent) === this.currentAnswer) {
                    btn.classList.add('correct');
                }
            });
            
            // Show correct answer
            document.getElementById('answerDisplay').textContent = this.currentAnswer;
        }
        
        this.questionsAnswered++;
        this.updateDisplay();
        
        // Check if level is complete
        if (this.questionsAnswered >= this.questionsInLevel) {
            setTimeout(() => this.showLevelComplete(), 2000);
        } else {
            // Next question after delay
            setTimeout(() => {
                this.generateProblem();
                feedback.textContent = '';
                feedback.className = 'feedback';
            }, 2500);
        }
    }
    
    showLevelComplete() {
        document.getElementById('levelComplete').style.display = 'flex';
    }
    
    nextLevel() {
        this.level++;
        this.questionsAnswered = 0;
        this.questionsInLevel = Math.min(5 + this.level, 10); // Increase questions per level
        
        document.getElementById('levelComplete').style.display = 'none';
        
        // Clear feedback
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        this.generateProblem();
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('correct').textContent = this.correct;
        document.getElementById('wrong').textContent = this.wrong;
        document.getElementById('streak').textContent = this.streak;
    }
    
    updateSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        const messages = [
            "Let's solve this together! 🦉",
            "What do you think the answer is?",
            "Take your time and think!",
            "You can do this! 💪",
            "Math is fun when you practice!",
            "Let's see if you can solve this one!"
        ];
        
        if (this.questionsAnswered === 0) {
            speechBubble.textContent = `Level ${this.level} - Let's start!`;
        } else {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            speechBubble.textContent = randomMessage;
        }
    }
}

// Initialize game when page loads
let mathGame;

document.addEventListener('DOMContentLoaded', function() {
    mathGame = new MathGame();
});

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}

// Make selectAnswer available globally for button onclick
function selectAnswer(button, answer) {
    mathGame.selectAnswer(button, answer);
}

function nextLevel() {
    mathGame.nextLevel();
}
