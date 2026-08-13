// Main game logic for CAST REVEAL

class CastRevealGame {
    constructor() {
        this.puzzle = getTodaysPuzzle();
        this.currentCastIndex = 0;
        
        // DOM elements
        this.movieGuessInput = document.getElementById('movieGuess');
        this.guessButton = document.getElementById('guessButton');
        this.sequencerBar = document.getElementById('sequencerBar');
        this.castImage = document.getElementById('castImage');
        this.castCharacter = document.getElementById('castCharacter');
        this.castRole = document.getElementById('castRole');
        this.autocompleteDropdown = document.getElementById('autocompleteDropdown');
        this.guessesRemaining = document.getElementById('guessesRemaining');
        this.endScreen = document.getElementById('endScreen');
        this.inputSection = document.getElementById('inputSection');
        this.currentDate = document.getElementById('currentDate');
        
        // Initialize
        this.init();
        this.attachEventListeners();
        this.updateDisplay();
    }

    init() {
        // Set current date
        this.currentDate.textContent = formatDate(this.puzzle.id);
        
        // If game is already completed, show end screen
        if (gameState.completed) {
            this.showEndScreen();
        } else {
            // Otherwise, display the next revealed actor
            this.displayCurrentActor();
        }
    }

    attachEventListeners() {
        this.guessButton.addEventListener('click', () => this.handleGuess());
        this.movieGuessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleGuess();
        });
        this.movieGuessInput.addEventListener('input', (e) => {
            this.handleAutocomplete(e.target.value);
        });
        this.movieGuessInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.autocompleteDropdown.classList.remove('active');
            }, 200);
        });
    }

    displayCurrentActor() {
        // Display actor at the current revealed index
        const actor = this.puzzle.cast[this.currentCastIndex];
        
        this.castCharacter.textContent = actor.character;
        this.castRole.textContent = `${actor.name} (Billing: ${actor.billing})`;
        
        // Update cast image (use placeholder if image fails)
        this.castImage.innerHTML = `<img src="${actor.image}" alt="${actor.name}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">`;
        
        this.updateSequencer();
        this.updateGuessCounter();
    }

    updateSequencer() {
        const slots = document.querySelectorAll('.slot');
        slots.forEach((slot, index) => {
            slot.classList.remove('active', 'correct');
            if (index < gameState.revealedIndex) {
                slot.classList.add('active');
            }
        });
    }

    updateGuessCounter() {
        const remaining = 10 - gameState.guesses;
        this.guessesRemaining.textContent = `GUESSES: ${remaining}/10`;
    }

    handleAutocomplete(query) {
        const results = searchMovies(query);
        
        if (results.length === 0) {
            this.autocompleteDropdown.classList.remove('active');
            return;
        }

        this.autocompleteDropdown.innerHTML = '';
        results.forEach(movie => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = `${movie.title} (${movie.year})`;
            item.addEventListener('click', () => {
                this.movieGuessInput.value = movie.title;
                this.autocompleteDropdown.classList.remove('active');
                this.handleGuess();
            });
            this.autocompleteDropdown.appendChild(item);
        });

        this.autocompleteDropdown.classList.add('active');
    }

    handleGuess() {
        const guess = this.movieGuessInput.value.trim();
        
        if (!guess) return;
        
        if (gameState.isGameOver()) {
            alert('GAME COMPLETE. Please reset to play again.');
            return;
        }

        gameState.incrementGuess();
        
        // Check if guess is correct
        if (compareMovieTitles(guess, this.puzzle.title)) {
            // CORRECT GUESS - Game Won!
            gameState.markComplete(true);
            gameStats.recordWin();
            this.revealAllActors();
            this.showEndScreen();
        } else {
            // WRONG GUESS - Reveal next actor
            gameState.revealNext();
            this.currentCastIndex = gameState.revealedIndex - 1;
            
            if (gameState.guesses >= 10) {
                // Max guesses reached - Game Lost
                gameState.markComplete(false);
                gameStats.recordLoss();
                this.showEndScreen();
            } else {
                // Update display for next actor
                this.movieGuessInput.value = '';
                this.movieGuessInput.focus();
                this.displayCurrentActor();
            }
        }
    }

    revealAllActors() {
        const slots = document.querySelectorAll('.slot');
        slots.forEach((slot) => {
            slot.classList.add('correct');
        });
    }

    updateDisplay() {
        this.displayCurrentActor();
    }

    showEndScreen() {
        this.inputSection.style.display = 'none';
        this.endScreen.style.display = 'flex';
        
        // Fill in end screen data
        document.getElementById('resultTitle').textContent = this.puzzle.title.toUpperCase();
        document.getElementById('resultYear').textContent = `(${this.puzzle.year})`;
        
        const guessRatio = gameState.guesses < 10 ? gameState.guesses : '10+';
        document.getElementById('guessRatio').textContent = `GUESS RATIO: ${guessRatio} / 10 CAST MEMBERS`;
        
        // Update stats
        document.getElementById('currentStreak').textContent = gameStats.currentStreak;
        document.getElementById('maxStreak').textContent = gameStats.maxStreak;
        document.getElementById('winPercentage').textContent = `${gameStats.getWinPercentage()}%`;
        
        // Generate and display share card
        this.setupShareCard();
        
        // Setup play again button
        document.getElementById('playAgainButton').addEventListener('click', () => {
            this.resetAndReload();
        });
    }

    setupShareCard() {
        const shareText = generateShareText(this.puzzle, gameState.guesses, `${gameState.guesses}/10 ACTORS`);
        document.getElementById('sharePreview').textContent = shareText;
        
        const copyButton = document.getElementById('copyShareButton');
        copyButton.addEventListener('click', async () => {
            const success = await copyToClipboard(shareText);
            if (success) {
                const originalText = copyButton.textContent;
                copyButton.textContent = '✓ COPIED';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }
        });
    }

    resetAndReload() {
        gameState.reset();
        location.reload();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CastRevealGame();
});
