#!/usr/bin/env node

/**
 * CAST REVEAL - Puzzle Generator
 *
 * This script fetches popular movies from TMDB and generates a year's worth
 * of daily puzzles. It runs automatically via GitHub Actions daily.
 *
 * Usage: node scripts/generatePuzzles.js
 * Environment: Requires TMDB_API_KEY in .env or environment
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import dotenv from 'dotenv'

dotenv.config()

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'puzzles.json')

if (!TMDB_API_KEY) {
  console.error('ERROR: TMDB_API_KEY not found in environment variables')
  console.error('Please set TMDB_API_KEY in .env or GitHub Actions secrets')
  process.exit(1)
}

// Helper to make HTTPS requests
function tmdbRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...params,
    })

    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`

    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    })
      .on('error', reject)
  })
}

// Fetch top-billed actors for a movie
async function getMovieCast(movieId) {
  try {
    const data = await tmdbRequest(`/movie/${movieId}/credits`)
    if (!data.cast || data.cast.length < 10) {
      return null
    }

    // Take top 10 cast members, sorted by billing order
    return data.cast.slice(0, 10).map((actor, index) => ({
      billing: 10 - index, // Reverse so lead is #1, not #10
      name: actor.name,
      character: actor.character || 'Unknown',
      profile_path: actor.profile_path,
    }))
  } catch (error) {
    console.error(`Failed to fetch cast for movie ${movieId}:`, error.message)
    return null
  }
}

// Generate puzzles for the entire year
async function generatePuzzles() {
  console.log('🎬 Generating Cast Reveal puzzles...')
  console.log(`   API Key: ${TMDB_API_KEY.substring(0, 5)}...`)

  const puzzles = {}
  const today = new Date('2026-08-13') // Test date
  let currentDate = new Date(today)
  currentDate.setDate(currentDate.getDate() - 180) // Start 180 days before today

  let fetchedCount = 0
  let successCount = 0
  const maxPuzzles = 365

  // Fetch popular movies
  let page = 1
  let allMovies = []

  console.log('📽️  Fetching popular movies from TMDB...')

  while (allMovies.length < maxPuzzles && page <= 100) {
    try {
      const data = await tmdbRequest('/movie/popular', {
        page: page.toString(),
        language: 'en-US',
      })

      if (data.results && data.results.length > 0) {
        allMovies = allMovies.concat(data.results)
        console.log(`   Fetched page ${page}: ${allMovies.length} total movies`)
      }

      if (!data.results || data.results.length === 0) break
      page++

      // Rate limiting: TMDB free tier is ~40 requests/10s
      await new Promise((resolve) => setTimeout(resolve, 300))
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message)
      break
    }
  }

  console.log(`✓ Total movies fetched: ${allMovies.length}`)
  console.log(`\n🧑‍🤝‍🧑 Generating daily puzzles with cast data...`)

  // Generate puzzles from fetched movies
  for (const movie of allMovies) {
    if (successCount >= maxPuzzles) break

    fetchedCount++
    if (fetchedCount % 50 === 0) {
      console.log(`   Processing movie ${fetchedCount}/${allMovies.length}...`)
    }

    // Skip movies without proper data
    if (!movie.id || !movie.title || !movie.release_date) {
      continue
    }

    const year = parseInt(movie.release_date.split('-')[0])
    if (year < 1980 || year > 2030) continue

    const cast = await getMovieCast(movie.id)
    if (!cast || cast.length < 10) {
      continue
    }

    // Format date for this puzzle
    const dateStr = currentDate.toISOString().split('T')[0]

    puzzles[dateStr] = {
      id: dateStr,
      title: movie.title,
      year: year,
      cast: cast,
    }

    successCount++

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  console.log(`\n✓ Successfully generated ${successCount} puzzles`)

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Write puzzles.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(puzzles, null, 2))
  console.log(`✓ Puzzles saved to: ${OUTPUT_FILE}`)
  console.log(`📊 Total puzzles generated: ${Object.keys(puzzles).length}`)

  // Print first few puzzles as verification
  console.log('\n📋 Sample puzzles:')
  const sampleDates = Object.keys(puzzles).slice(0, 3)
  sampleDates.forEach((date) => {
    const p = puzzles[date]
    console.log(`   ${date}: "${p.title}" (${p.year}) - ${p.cast.length} cast members`)
  })
}

// Run generator
generatePuzzles().catch((error) => {
  console.error('❌ Generator failed:', error.message)
  process.exit(1)
})
