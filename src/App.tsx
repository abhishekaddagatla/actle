import React, { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Puzzle, GameState, GameStats, Actor, TMDBMovie } from './types'
import { LocalStorageManager, formatDate, isAcceptableGuess } from './utils'
import { searchMovies } from './services/tmdb'
import { Sequencer } from './components/Sequencer'
import { CastDisplay } from './components/CastDisplay'
import Confetti from './components/Confetti'
import { Autocomplete } from './components/Autocomplete'
import { EndScreen } from './components/EndScreen'
import { HelpModal } from './components/HelpModal'
import './App.css'

const App: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [allPuzzles, setAllPuzzles] = useState<Record<string, Puzzle> | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [stats, setStats] = useState<GameStats | null>(null)
  const [movieInput, setMovieInput] = useState('')
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shake, setShake] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsTimeoutRef = useRef<number | undefined>(undefined)

  // Load today's puzzle
  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const response = await fetch('/puzzles.json')
        const data = await response.json()
        setAllPuzzles(data)
        const today = LocalStorageManager.getToday()
        const todayPuzzle = data[today]

        // If in development (localhost or vite dev), pick a random puzzle to avoid repeating same movie
        const runningDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || (import.meta as any).env?.MODE === 'development')
        if (runningDev) {
          const keys = Object.keys(data)
          if (keys.length > 0) {
            const rand = keys[Math.floor(Math.random() * keys.length)]
            setPuzzle(data[rand])
            // Reset game state for that date so solved flags are cleared
            const newState = LocalStorageManager.setGameStateForDate(rand)
            setGameState(newState)
          }
        } else if (todayPuzzle) {
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

  // Check for first-time user and show help modal
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('castReveal_hasSeenHelp')
    if (!hasSeenHelp && !isLoading) {
      setShowHelp(true)
      localStorage.setItem('castReveal_hasSeenHelp', 'true')
    }
  }, [isLoading])

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
    // pass tmdb id to guess for exact id matching
    handleGuess(movie.title, movie.id)
  }
  const handleGuess = (title: string = movieInput, tmdbId?: number) => {
    if (!title.trim() || !gameState || !puzzle || gameState.isCompleted) {
      return
    }
    const guess = title.trim()
    const newState = { ...gameState }
    newState.guesses.push(guess)
    // Accept correct if normalized match OR user selected suggestion matching puzzle tmdb id
    const tmdbMatch = typeof tmdbId === 'number' && typeof puzzle.tmdb_id === 'number' && tmdbId === puzzle.tmdb_id
    if (isAcceptableGuess(guess, puzzle.title, { tmdbMatch })) {
      // Correct guess!
      // record which slot index was correct (current visible index)
      const solvedIdx = gameState.currentGuessStep
      newState.solvedIndex = solvedIdx
      newState.revealedBeforeSolve = gameState.currentGuessStep + 1
      newState.isCompleted = true
      // reveal all actors on win
      newState.currentGuessStep = puzzle.cast.length - 1

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
      // celebration
      setCelebrate(true)
      setBounce(true)
      setTimeout(() => setBounce(false), 600)
      setTimeout(() => setCelebrate(false), 3000)
      // ensure cast grid scrolls left when solved
      setTimeout(() => {
        const grid = document.querySelector('.cast-grid') as HTMLElement | null
        if (grid) grid.scrollLeft = 0
      }, 100)
    } else {
      // Wrong guess - reveal next actor
      if (newState.currentGuessStep < puzzle.cast.length - 1) {
        newState.currentGuessStep++
      }

      // trigger wrong animation
      setShake(true)
      setBounce(true)
      setTimeout(() => setShake(false), 620)
      setTimeout(() => setBounce(false), 420)

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
      // Auto-scroll cast grid to the right to show the new actor
      setTimeout(() => {
        const grid = document.querySelector('.cast-grid') as HTMLElement | null
        if (grid) {
          grid.scrollLeft = grid.scrollWidth - grid.clientWidth
        }
      }, 50)
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

  // Dev helper: switch to a different puzzle date (for testing)
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || (import.meta as any).env?.MODE === 'development')

  const handleChangePuzzle = (dateStr: string) => {
    if (!allPuzzles) return
    const p = allPuzzles[dateStr]
    if (!p) return

    // Set puzzle and reset game state to that date for testing
    setPuzzle(p)
    const newState = LocalStorageManager.setGameStateForDate(dateStr)
    setGameState(newState)
    setMovieInput('')
    setShowSuggestions(false)
    if (inputRef.current) inputRef.current.focus()
    // reset cast grid scroll
    setTimeout(() => {
      const grid = document.querySelector('.cast-grid') as HTMLElement | null
      if (grid) grid.scrollLeft = 0
    }, 50)
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
          <div className="header-title">CAST REVEAL</div>
          <div className="header-sub">LOADING...</div>
        </div>
      </div>
    )
  }

  const currentActor = getCurrentActor()
  const guessesRemaining = 10 - gameState.guesses.length

  return (
    <div className="container">
      {/* Help Button */}
      <button className="help-button" onClick={() => setShowHelp(true)} title="How to play">
        ?
      </button>

      {/* System Header */}
      <div className="system-header">
        <div className="header-title">actle</div>
        <div className="header-sub">{formatDate(puzzle.id)}</div>
      </div>

      {/* Sequencer Bar */}
      {isDev && allPuzzles ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <button
            onClick={() => {
              // pick a random puzzle from allPuzzles
              if (!allPuzzles) return
              const keys = Object.keys(allPuzzles)
              const rand = keys[Math.floor(Math.random() * keys.length)]
              handleChangePuzzle(rand)
            }}
            style={{
              padding: '10px 20px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: '1px solid var(--color-accent)',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            New Game
          </button>
        </div>
      ) : null}

      {/* compute revealed actors count (always at least 1) */}
      {puzzle && gameState && (
        (() => {
          const revealedCount = Math.min(puzzle.cast.length, Math.max(1, gameState.currentGuessStep + 1))
          return (
            <>
              <Sequencer revealedCount={revealedCount} solvedIndex={gameState.solvedIndex} revealedBeforeSolve={gameState.revealedBeforeSolve} isCompleted={gameState.isCompleted} />
              {/* Cast list shows first `revealedCount` actors (or all when solved) */}
              {gameState.solvedIndex !== undefined ? (
                <CastDisplay actors={puzzle.cast} bounce={bounce} />
              ) : (
                <CastDisplay actors={puzzle.cast.slice(0, revealedCount)} bounce={bounce} />
              )}
            </>
          )
        })()
      )}
      

      {/* Game Input or End Screen */}
      {!gameState.isCompleted ? (
        <div className={`input-section ${shake ? 'shake' : ''}`}>
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
          {/* Previous guesses list */}
          <div className="guesses-list">
            {gameState.guesses.length === 0 ? null : (
              gameState.guesses.map((g, i) => {
                const isCorrect = isAcceptableGuess(g, puzzle.title)
                return (
                  <div key={`${g}-${i}`} className={`guess-item ${isCorrect ? 'correct' : 'wrong'}`}>
                    {g}
                  </div>
                )
              })
            )}
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
          solvedIndex={gameState.solvedIndex}
          stats={stats}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {celebrate ? <Confetti /> : null}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <Analytics />
    </div>
  )
}

export default App
