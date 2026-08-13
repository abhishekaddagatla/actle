import React, { useState, useEffect, useRef } from 'react'
import { Puzzle, GameState, GameStats, Actor, TMDBMovie } from './types'
import { LocalStorageManager, formatDate, compareMovieTitles } from './utils'
import { searchMovies } from './services/tmdb'
import { Sequencer } from './components/Sequencer'
import { CastDisplay } from './components/CastDisplay'
import { Autocomplete } from './components/Autocomplete'
import { EndScreen } from './components/EndScreen'
import './App.css'

const App: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [stats, setStats] = useState<GameStats | null>(null)
  const [movieInput, setMovieInput] = useState('')
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsTimeoutRef = useRef<number | undefined>(undefined)

  // Load today's puzzle
  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const response = await fetch('/puzzles.json')
        const data = await response.json()
        const today = LocalStorageManager.getToday()
        const todayPuzzle = data[today]

        if (todayPuzzle) {
          setPuzzle(todayPuzzle)
        } else {
          console.error('No puzzle found for today')
          // Fallback: use first available puzzle
          const firstDate = Object.keys(data)[0]
          if (firstDate) {
            setPuzzle(data[firstDate])
          }
        }

        setGameState(LocalStorageManager.getGameState())
        setStats(LocalStorageManager.getStats())
      } catch (error) {
        console.error('Failed to load puzzle:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPuzzle()
  }, [])

  const getCurrentActor = (): Actor | null => {
    if (!puzzle || !gameState) return null
    if (gameState.currentGuessStep >= puzzle.cast.length) return null
    return puzzle.cast[gameState.currentGuessStep]
  }

  const handleMovieSearch = async (query: string) => {
    setMovieInput(query)

    if (suggestionsTimeoutRef.current) {
      window.clearTimeout(suggestionsTimeoutRef.current)
    }

    if (!query || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    suggestionsTimeoutRef.current = window.setTimeout(async () => {
      const results = await searchMovies(query)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }, 300)
  }

  const handleSuggestionSelect = (movie: TMDBMovie) => {
    setMovieInput(movie.title)
    setShowSuggestions(false)
    handleGuess(movie.title)
  }

  const handleGuess = (title: string = movieInput) => {
    if (!title.trim() || !gameState || !puzzle || gameState.isCompleted) {
      return
    }

    const guess = title.trim()
    const newState = { ...gameState }
    newState.guesses.push(guess)

    if (compareMovieTitles(guess, puzzle.title)) {
      // Correct guess!
      newState.isCompleted = true
      newState.currentGuessStep = puzzle.cast.length

      const newStats = { ...stats! }
      newStats.wins++
      newStats.played++
      newStats.currentStreak++
      if (newStats.currentStreak > newStats.maxStreak) {
        newStats.maxStreak = newStats.currentStreak
      }
      if (newState.guesses.length <= 10) {
        newStats.guessDistribution[newState.guesses.length - 1]++
      }

      setGameState(newState)
      setStats(newStats)
      LocalStorageManager.saveGameState(newState)
      LocalStorageManager.saveStats(newStats)
    } else {
      // Wrong guess - reveal next actor
      if (newState.currentGuessStep < puzzle.cast.length - 1) {
        newState.currentGuessStep++
      }

      // Check if max guesses reached
      if (newState.guesses.length >= 10) {
        newState.isCompleted = true

        const newStats = { ...stats! }
        newStats.played++
        newStats.currentStreak = 0
        setStats(newStats)
        LocalStorageManager.saveStats(newStats)
      }

      setGameState(newState)
      LocalStorageManager.saveGameState(newState)
    }

    setMovieInput('')
    setShowSuggestions(false)
  }

  const handlePlayAgain = () => {
    LocalStorageManager.resetGameState()
    setGameState(LocalStorageManager.getGameState())
    setMovieInput('')
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        handleSuggestionSelect(suggestions[0])
      } else {
        handleGuess()
      }
    }
  }

  if (isLoading || !puzzle || !gameState || !stats) {
    return (
      <div className="container">
        <div className="system-header">
          <div className="header-label">[SYSTEM // CAST_REVEAL]</div>
          <div className="header-date">LOADING...</div>
        </div>
      </div>
    )
  }

  const currentActor = getCurrentActor()
  const guessesRemaining = 10 - gameState.guesses.length

  return (
    <div className="container">
      {/* System Header */}
      <div className="system-header">
        <div className="header-label">[SYSTEM // CAST_REVEAL]</div>
        <div className="header-date">{formatDate(puzzle.id)}</div>
      </div>

      {/* Sequencer Bar */}
      <Sequencer revealedCount={gameState.currentGuessStep + 1} />

      {/* Cast Display */}
      <CastDisplay actor={currentActor} />

      {/* Game Input or End Screen */}
      {!gameState.isCompleted ? (
        <div className="input-section">
          <div className="input-label">[INPUT // GUESS_MOVIE]</div>
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={movieInput}
              onChange={(e) => handleMovieSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => movieInput && showSuggestions && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter movie title..."
              className="movie-input"
              disabled={gameState.isCompleted}
              autoComplete="off"
            />
            <button
              className="guess-button"
              onClick={() => handleGuess()}
              disabled={gameState.isCompleted || !movieInput.trim()}
            >
              SUBMIT
            </button>
          </div>
          <Autocomplete
            suggestions={suggestions}
            isOpen={showSuggestions}
            onSelect={handleSuggestionSelect}
          />
          <div className="guess-counter">
            <span>
              GUESSES: {guessesRemaining > 0 ? guessesRemaining : 0}/10
            </span>
          </div>
        </div>
      ) : (
        <EndScreen
          puzzle={puzzle}
          guessCount={gameState.guesses.length}
          stats={stats}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}

export default App
