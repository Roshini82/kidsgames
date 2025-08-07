// Simple Piano Game Logic
class SimplePianoGame {
    constructor() {
        this.notes = [
            { note: 'C', frequency: 261.63, color: '#ff6b6b' },
            { note: 'C#', frequency: 277.18, color: '#2d3436', isBlack: true },
            { note: 'D', frequency: 293.66, color: '#ff9f43' },
            { note: 'D#', frequency: 311.13, color: '#2d3436', isBlack: true },
            { note: 'E', frequency: 329.63, color: '#feca57' },
            { note: 'F', frequency: 349.23, color: '#48dbfb' },
            { note: 'F#', frequency: 369.99, color: '#2d3436', isBlack: true },
            { note: 'G', frequency: 392.00, color: '#1dd1a1' },
            { note: 'G#', frequency: 415.30, color: '#2d3436', isBlack: true },
            { note: 'A', frequency: 440.00, color: '#a29bfe' },
            { note: 'A#', frequency: 466.16, color: '#2d3436', isBlack: true },
            { note: 'B', frequency: 493.88, color: '#fd79a8' }
        ];
        
        this.songs = {
            twinkle: {
                name: "Twinkle Twinkle Little Star",
                notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
                tempo: 500
            },
            mary: {
                name: "Mary Had a Little Lamb",
                notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'],
                tempo: 400
            },
            happy: {
                name: "Happy Birthday",
                notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F'],
                tempo: 450
            }
        };
        
        this.currentMode = 'freeplay';
        this.notesPlayed = 0;
        this.songsLearned = 0;
        this.achievements = {
            'first-note': false,
            'melody-maker': false,
            'piano-player': false,
            'music-master': false
        };
        
        this.audioContext = null;
        this.speechBubble = document.getElementById('speechBubble');
        this.pianoKeys = document.getElementById('pianoKeys');
        this.floatingNotes = document.getElementById('floatingNotes');
        
        this.noteEmojis = ['🎵', '🎶', '♪', '♫', '🎼'];
        
        this.loadAchievements();
        this.createPiano();
        this.updateDisplay();
    }
    
    createPiano() {
        this.pianoKeys.innerHTML = '';
        
        // Create white keys first
        const whiteNotes = this.notes.filter(note => !note.isBlack);
        whiteNotes.forEach(noteData => {
            const key = this.createKey(noteData, false);
            this.pianoKeys.appendChild(key);
        });
        
        // Create black keys and position them
        const blackNotes = this.notes.filter(note => note.isBlack);
        const blackPositions = [1, 2, 4, 5, 6]; // Positions between white keys
        
        blackNotes.forEach((noteData, index) => {
            const key = this.createKey(noteData, true);
            key.style.left = `${blackPositions[index] * 62 - 20}px`; // Position between white keys
            this.pianoKeys.appendChild(key);
        });
    }
    
    createKey(noteData, isBlack) {
        const key = document.createElement('div');
        key.className = `piano-key ${isBlack ? 'black' : 'white'}`;
        key.setAttribute('data-note', noteData.note);
        key.textContent = noteData.note;
        
        // Add color class for color mode
        if (!isBlack) {
            key.classList.add(noteData.note.toLowerCase());
        }
        
        key.addEventListener('mousedown', () => this.playNote(noteData));
        key.addEventListener('mouseup', () => this.stopNote(key));
        key.addEventListener('mouseleave', () => this.stopNote(key));
        
        // Touch events for mobile
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.playNote(noteData);
        });
        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopNote(key);
        });
        
        return key;
    }
    
    playNote(noteData) {
        // Initialize audio context if not already done
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create oscillator for the note
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(noteData.frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
        
        // Visual feedback
        const key = document.querySelector(`[data-note="${noteData.note}"]`);
        key.classList.add('active');
        
        // Create floating note animation
        this.createFloatingNote(noteData, key);
        
        // Update stats
        this.notesPlayed++;
        this.updateDisplay();
        this.checkAchievements();
        
        // Update speech bubble with note name
        this.speechBubble.textContent = `You played ${noteData.note}! ${this.getEncouragingMessage()}`;
    }
    
    stopNote(key) {
        key.classList.remove('active');
    }
    
    createFloatingNote(noteData, key) {
        const note = document.createElement('div');
        note.className = 'floating-note';
        note.textContent = this.noteEmojis[Math.floor(Math.random() * this.noteEmojis.length)];
        note.style.color = noteData.color;
        
        // Position above the key
        const keyRect = key.getBoundingClientRect();
        const containerRect = this.floatingNotes.getBoundingClientRect();
        
        note.style.left = `${keyRect.left - containerRect.left + keyRect.width / 2}px`;
        note.style.top = `${keyRect.top - containerRect.top}px`;
        
        this.floatingNotes.appendChild(note);
        
        // Remove after animation
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 3000);
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode === 'freeplay' ? 'freePlay' : mode === 'learn' ? 'learnSongs' : 'colorMode'}Btn`).classList.add('active');
        
        // Show/hide song controls
        const songControls = document.getElementById('songControls');
        songControls.style.display = mode === 'learn' ? 'flex' : 'none';
        
        // Apply color mode styling
        const keys = document.querySelectorAll('.piano-key');
        if (mode === 'colors') {
            keys.forEach(key => key.classList.add('color-mode'));
            this.speechBubble.textContent = "🌈 Color Mode! Each key has its own special color. Play and watch the rainbow!";
        } else {
            keys.forEach(key => key.classList.remove('color-mode'));
            if (mode === 'freeplay') {
                this.speechBubble.textContent = "🎵 Free Play Mode! Create your own beautiful melodies by clicking any keys you like!";
            } else if (mode === 'learn') {
                this.speechBubble.textContent = "📚 Learn Mode! Choose a song and I'll help you play it step by step!";
            }
        }
        
        this.updateDisplay();
    }
    
    selectSong() {
        const songSelect = document.getElementById('songSelect');
        const selectedSong = songSelect.value;
        
        if (selectedSong && this.songs[selectedSong]) {
            this.speechBubble.textContent = `Great choice! "${this.songs[selectedSong].name}" is a beautiful song. Click "Play Song" to hear it!`;
        }
    }
    
    playSong() {
        const songSelect = document.getElementById('songSelect');
        const selectedSong = songSelect.value;
        
        if (!selectedSong || !this.songs[selectedSong]) {
            this.speechBubble.textContent = "Please choose a song first!";
            return;
        }
        
        const song = this.songs[selectedSong];
        this.speechBubble.textContent = `🎵 Playing "${song.name}"! Watch the keys light up and try to play along!`;
        
        this.playSongSequence(song.notes, song.tempo, 0);
    }
    
    playSongSequence(notes, tempo, index) {
        if (index >= notes.length) {
            this.speechBubble.textContent = `🎉 Beautiful! You just heard "${document.getElementById('songSelect').selectedOptions[0].text}"! Try playing it yourself!`;
            this.songsLearned++;
            this.updateDisplay();
            this.checkAchievements();
            return;
        }
        
        const note = notes[index];
        const noteData = this.notes.find(n => n.note === note);
        
        if (noteData) {
            this.playNote(noteData);
            
            setTimeout(() => {
                this.playSongSequence(notes, tempo, index + 1);
            }, tempo);
        }
    }
    
    getEncouragingMessage() {
        const messages = [
            "Keep making music! 🎵",
            "Beautiful sound! 🌟",
            "You're a natural! 👏",
            "Music magic! ✨",
            "Wonderful! 🎶",
            "Amazing! 🎯",
            "Keep playing! 🚀",
            "Fantastic! 🎊"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    checkAchievements() {
        // First Note
        if (this.notesPlayed >= 1 && !this.achievements['first-note']) {
            this.unlockAchievement('first-note');
        }
        
        // Melody Maker
        if (this.notesPlayed >= 10 && !this.achievements['melody-maker']) {
            this.unlockAchievement('melody-maker');
        }
        
        // Piano Player
        if (this.notesPlayed >= 50 && !this.achievements['piano-player']) {
            this.unlockAchievement('piano-player');
        }
        
        // Music Master
        if (this.notesPlayed >= 100 && this.songsLearned >= 2 && !this.achievements['music-master']) {
            this.unlockAchievement('music-master');
        }
    }
    
    unlockAchievement(achievementId) {
        this.achievements[achievementId] = true;
        const achievementEl = document.getElementById(achievementId);
        achievementEl.classList.add('unlocked');
        
        // Show celebration message
        const achievementNames = {
            'first-note': 'First Note Player',
            'melody-maker': 'Melody Maker',
            'piano-player': 'Piano Player',
            'music-master': 'Music Master'
        };
        
        setTimeout(() => {
            this.speechBubble.textContent = `🏆 Achievement Unlocked: ${achievementNames[achievementId]}! You're becoming a great musician!`;
        }, 500);
        
        this.saveAchievements();
    }
    
    updateDisplay() {
        document.getElementById('currentMode').textContent = this.currentMode === 'freeplay' ? 'Free Play' : 
                                                            this.currentMode === 'learn' ? 'Learn Songs' : 'Color Mode';
        document.getElementById('notesPlayed').textContent = this.notesPlayed;
        document.getElementById('songsLearned').textContent = this.songsLearned;
    }
    
    saveAchievements() {
        localStorage.setItem('pianoAchievements', JSON.stringify(this.achievements));
        localStorage.setItem('pianoNotesPlayed', this.notesPlayed.toString());
        localStorage.setItem('pianoSongsLearned', this.songsLearned.toString());
    }
    
    loadAchievements() {
        const savedAchievements = localStorage.getItem('pianoAchievements');
        const savedNotes = localStorage.getItem('pianoNotesPlayed');
        const savedSongs = localStorage.getItem('pianoSongsLearned');
        
        if (savedAchievements) {
            this.achievements = JSON.parse(savedAchievements);
        }
        
        if (savedNotes) {
            this.notesPlayed = parseInt(savedNotes);
        }
        
        if (savedSongs) {
            this.songsLearned = parseInt(savedSongs);
        }
        
        // Apply unlocked achievements
        setTimeout(() => {
            Object.keys(this.achievements).forEach(achievementId => {
                if (this.achievements[achievementId]) {
                    document.getElementById(achievementId).classList.add('unlocked');
                }
            });
        }, 100);
    }
}

// Game instance
let pianoGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    pianoGame = new SimplePianoGame();
});

// Control functions
function setMode(mode) {
    pianoGame.setMode(mode);
}

function selectSong() {
    pianoGame.selectSong();
}

function playSong() {
    pianoGame.playSong();
}

// Navigation function
function goBack() {
    window.location.href = '../index.html';
}
