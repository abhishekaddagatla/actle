import { GameState, GameStats, Puzzle } from './types'

const GAME_STATE_KEY = 'castReveal_gameState'
const GAME_STATS_KEY = 'castReveal_stats'

export class LocalStorageManager {
  static getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  static getGameState(): GameState {
    const saved = localStorage.getItem(GAME_STATE_KEY)
    const today = this.getToday()

    if (saved) {
      const state = JSON.parse(saved) as GameState
      // Reset if new day
      if (state.lastPlayedDate !== today) {
        return this.resetGameState()
      }
      return state
    }

    return this.resetGameState()
  }

  static resetGameState(): GameState {
    const state: GameState = {
      lastPlayedDate: this.getToday(),
      currentGuessStep: 0,
      guesses: [],
      isCompleted: false,
      solvedIndex: undefined,
      revealedBeforeSolve: undefined,
    }
    this.saveGameState(state)
    return state
  }

  // For testing: set game state to a specific puzzle date (useful for dev)
  static setGameStateForDate(dateStr: string): GameState {
    const state: GameState = {
      lastPlayedDate: dateStr,
      currentGuessStep: 0,
      guesses: [],
      isCompleted: false,
      solvedIndex: undefined,
      revealedBeforeSolve: undefined,
    }
    this.saveGameState(state)
    return state
  }

  static saveGameState(state: GameState): void {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state))
  }

  static getStats(): GameStats {
    const saved = localStorage.getItem(GAME_STATS_KEY)

    if (saved) {
      return JSON.parse(saved) as GameStats
    }

    return this.resetStats()
  }

  static resetStats(): GameStats {
    const stats: GameStats = {
      played: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    this.saveStats(stats)
    return stats
  }

  static saveStats(stats: GameStats): void {
    localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats))
  }

  static recordWin(guessCount: number): void {
    const stats = this.getStats()
    stats.played++
    stats.wins++
    stats.currentStreak++
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak
    }
    if (guessCount > 0 && guessCount <= 10) {
      stats.guessDistribution[guessCount - 1]++
    }
    this.saveStats(stats)
  }

  static recordLoss(): void {
    const stats = this.getStats()
    stats.played++
    stats.currentStreak = 0
    this.saveStats(stats)
  }

  static getWinPercentage(): number {
    const stats = this.getStats()
    if (stats.played === 0) return 0
    return Math.round((stats.wins / stats.played) * 100)
  }
}

export function compareMovieTitles(title1: string, title2: string): boolean {
  return normalize(title1) === normalize(title2)
}

// Normalize strings for matching: remove diacritics, punctuation, parentheses, leading articles, collapse spaces
export function normalize(s: string): string {
  if (!s) return ''
  // remove unicode diacritics
    let out = s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '') // remove parenthetical content
    .replace(/[^a-z0-9\s]/gi, ' ') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  // strip leading articles
  out = out.replace(/^(the|a|an)\s+/i, '')
  return out
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// More flexible acceptance: exact normalized match, id-confirmed, whole-phrase contains, or multi-word subset
export function isAcceptableGuess(
  guess: string,
  title: string,
  options?: { tmdbMatch?: boolean }
): boolean {
  const g = normalize(guess)
  const t = normalize(title)
  if (!g) return false
  if (g === t) return true
  if (options?.tmdbMatch) return true

  // whole phrase match (require reasonable length)
  if (g.length >= 4) {
    const re = new RegExp('\\b' + escapeRegExp(g) + '\\b')
    if (re.test(t)) return true
  }

  // multi-word subset: all words appear in title
  const words = g.split(' ').filter(Boolean)
  if (words.length >= 2 && words.every((w) => t.includes(w))) return true

  return false
}

export function generateShareText(puzzle: Puzzle, guessCount: number, solvedIndex?: number): string {
  const totalSlots = 10
  const usedSlots = Math.min(guessCount, 10)
  const isWin = typeof solvedIndex === 'number'

  let sequence = ''
  for (let i = 0; i < totalSlots; i++) {
    if (i < usedSlots - 1) {
      sequence += '🟥 ' // Red = wrong guesses
    } else if (i === usedSlots - 1) {
      // Last slot is green only if won, red if lost
      sequence += isWin ? '🟩 ' : '🟥 '
    } else {
      sequence += '⬜ ' // White = unused
    }
  }

  const dateNum = puzzle.id.replace(/-/g, '').slice(-2)
  return `CAST REVEAL #${dateNum} 🎬
${guessCount}/10 ACTORS

${sequence.trim()}
https://castreveal.game`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    }
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
