import React from 'react'
import { Puzzle, GameStats } from '../types'
import { generateShareText, copyToClipboard } from '../utils'

interface EndScreenProps {
  puzzle: Puzzle
  guessCount: number
  stats: GameStats
  onPlayAgain: () => void
}

export const EndScreen: React.FC<EndScreenProps> = ({
  puzzle,
  guessCount,
  stats,
  onPlayAgain,
}) => {
  const shareText = generateShareText(puzzle, guessCount)
  const [copySuccess, setCopySuccess] = React.useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(shareText)
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const winPercentage =
    stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100)

  return (
    <div className="end-screen">
      <div className="end-header">[SYSTEM // PUZZLE_SOLVED]</div>

      <div className="result-container">
        <div className="result-title">{puzzle.title.toUpperCase()}</div>
        <div className="result-year">({puzzle.year})</div>
        <div className="guess-ratio">
          GUESS RATIO: {guessCount} / 10 CAST MEMBERS
        </div>
      </div>

      <div className="stats-block">
        <div className="stat-item">
          <span className="stat-label">CURRENT STREAK:</span>
          <span className="stat-value">{stats.currentStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">MAX STREAK:</span>
          <span className="stat-value">{stats.maxStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">WIN %:</span>
          <span className="stat-value">{winPercentage}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">TOTAL GAMES:</span>
          <span className="stat-value">{stats.played}</span>
        </div>
      </div>

      <div className="share-card">
        <div className="share-label">[SHARE // COPY_RESULT]</div>
        <button className="copy-button" onClick={handleCopy}>
          {copySuccess ? '✓ COPIED' : '📋 COPY SHARE CARD'}
        </button>
        <div className="share-preview">{shareText}</div>
      </div>

      <button className="play-again-button" onClick={onPlayAgain}>
        RESET GAME
      </button>
    </div>
  )
}
