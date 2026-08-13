// Utility functions for localStorage and date handling

class GameState {
    constructor() {
        this.storageKey = 'castReveal_gameState';
        this.statsKey = 'castReveal_stats';
        this.load();
    }

    load() {
        const today = this.getToday();
        const saved = localStorage.getItem(this.storageKey);
        
        if (saved) {
            const state = JSON.parse(saved);
            // Reset if new day
            if (state.date !== today) {
                this.reset();
            } else {
                this.date = state.date;
                this.guesses = state.guesses || 0;
                this.completed = state.completed || false;
                this.solved = state.solved || false;
                this.revealedIndex = state.revealedIndex || 0;
            }
        } else {
            this.reset();
        }
    }

    reset() {
        this.date = this.getToday();
        this.guesses = 0;
        this.completed = false;
        this.solved = false;
        this.revealedIndex = 0;
        this.save();
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            date: this.date,
            guesses: this.guesses,
            completed: this.completed,
            solved: this.solved,
            revealedIndex: this.revealedIndex
        }));
    }

    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    incrementGuess() {
        this.guesses++;
        this.save();
    }

    markComplete(solved) {
        this.completed = true;
        this.solved = solved;
        this.save();
    }

    revealNext() {
        if (this.revealedIndex < 10) {
            this.revealedIndex++;
            this.save();
        }
    }

    isGameOver() {
        return this.completed || this.guesses >= 10;
    }

    isToday(dateStr) {
        return dateStr === this.getToday();
    }
}

class GameStats {
    constructor() {
        this.storageKey = 'castReveal_stats';
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const stats = JSON.parse(saved);
            this.totalGames = stats.totalGames || 0;
            this.wins = stats.wins || 0;
            this.currentStreak = stats.currentStreak || 0;
            this.maxStreak = stats.maxStreak || 0;
            this.lastPlayDate = stats.lastPlayDate || null;
        } else {
            this.totalGames = 0;
            this.wins = 0;
            this.currentStreak = 0;
            this.maxStreak = 0;
            this.lastPlayDate = null;
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            totalGames: this.totalGames,
            wins: this.wins,
            currentStreak: this.currentStreak,
            maxStreak: this.maxStreak,
            lastPlayDate: this.lastPlayDate
        }));
    }

    recordWin() {
        this.totalGames++;
        this.wins++;
        this.currentStreak++;
        if (this.currentStreak > this.maxStreak) {
            this.maxStreak = this.currentStreak;
        }
        this.lastPlayDate = new Date().toISOString().split('T')[0];
        this.save();
    }

    recordLoss() {
        this.totalGames++;
        this.currentStreak = 0;
        this.lastPlayDate = new Date().toISOString().split('T')[0];
        this.save();
    }

    getWinPercentage() {
        if (this.totalGames === 0) return 0;
        return Math.round((this.wins / this.totalGames) * 100);
    }
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Compare movie titles (case-insensitive, trim whitespace)
function compareMovieTitles(title1, title2) {
    return title1.trim().toLowerCase() === title2.trim().toLowerCase();
}

// Generate share text for puzzle
function generateShareText(puzzle, guessesUsed, guessRatio) {
    // Create share card emoji sequence
    const totalSlots = 10;
    const usedSlots = Math.min(guessesUsed, 10);
    const correctSlot = Math.max(usedSlots - 1, 0); // Last used was the correct guess
    
    let sequence = '';
    for (let i = 0; i < totalSlots; i++) {
        if (i < correctSlot) {
            sequence += '🟧 '; // Orange = hint used
        } else if (i === correctSlot) {
            sequence += '🟩 '; // Green = correct guess
        } else {
            sequence += '⬜ '; // White = unused
        }
    }

    const dateNum = puzzle.id.replace(/-/g, '').slice(-2); // Last 2 digits of date
    const text = `CAST REVEAL #${dateNum} 🎬
${guessRatio}

${sequence.trim()}
https://castreveal.game`;

    return text;
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Initialize game state and stats
const gameState = new GameState();
const gameStats = new GameStats();
