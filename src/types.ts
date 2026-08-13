export interface Actor {
  billing: number
  name: string
  character: string
  profile_path: string | null
}

export interface Puzzle {
  id: string
  title: string
  year: number
  cast: Actor[]
}

export interface GameState {
  lastPlayedDate: string
  currentGuessStep: number
  guesses: string[]
  isCompleted: boolean
}

export interface GameStats {
  played: number
  wins: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
}

export interface TMDBMovie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}
