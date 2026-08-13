import axios from 'axios'
import { TMDBMovie } from '../types'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query || query.length < 1) return []

  try {
    const response = await tmdbClient.get('/search/movie', {
      params: {
        query: query.trim(),
        page: 1,
      },
    })

    return response.data.results.slice(0, 8).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
    }))
  } catch (error) {
    console.error('TMDB search error:', error)
    return []
  }
}

export async function getMovieCredits(movieId: number) {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/credits`)
    return response.data.cast || []
  } catch (error) {
    console.error('TMDB credits error:', error)
    return []
  }
}

export function getImageUrl(
  path: string | null,
  size: 'w185' | 'w300' | 'w500' = 'w300'
): string {
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image'
  return `https://image.tmdb.org/t/p/${size}${path}`
}
