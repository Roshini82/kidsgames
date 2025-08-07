// Navigation function for games
function navigateToGame(gameUrl) {
    // Add a loading effect
    const clickedButton = event.target.closest('.play-btn');
    const originalText = clickedButton.innerHTML;
    
    // Show loading state
    clickedButton.innerHTML = '<span>Loading...</span><span class="arrow">⏳</span>';
    clickedButton.style.pointerEvents = 'none';
    
    // Navigate after a short delay for better UX
    setTimeout(() => {
        window.location.href = gameUrl;
    }, 500);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sound effect (optional - can be enabled later)
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add gentle bounce effect
            this.style.animation = 'cardHover 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // Add click ripple effect to buttons
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add welcome message
    setTimeout(() => {
        console.log('🎮 Welcome to Tara\'s Game Hub! Choose your favorite game to start playing! 🌟');
    }, 1000);
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .play-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes cardHover {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
        100% { transform: translateY(0px); }
    }
`;
document.head.appendChild(style);
