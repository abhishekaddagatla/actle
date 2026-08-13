# CAST REVEAL 🎬

A serverless, Wordle-style daily movie puzzle game built with **React** and powered by **TMDB API**. Guess the movie by revealing actors from supporting cast to lead.

## Key Features

✅ **React + TypeScript** - Type-safe, component-based architecture  
✅ **10-Step Sequencer Bar** - Visual LED-style progress tracker  
✅ **Cast Reveal Sequence** - Supporting actors → Lead (top billing)  
✅ **Live Movie Search** - TMDB API autocomplete with 50K+ movies  
✅ **Daily Puzzles** - Auto-generated from TMDB, perfect cast data  
✅ **Perfect Offline Support** - All game state in browser localStorage  
✅ **Teenage Engineering Aesthetic** - Monospace fonts, signal orange accents  
✅ **Shareable Results** - Copy emoji-based performance card  
✅ **Streak Tracking** - Current streak, max streak, win percentage  
✅ **Serverless Deployment** - Free Vercel hosting, zero backend costs  

## Architecture

- **Frontend**: React + TypeScript, Vite bundler
- **Hosting**: Vercel (free tier, auto-deploys on git push)
- **Daily Puzzles**: Pre-generated `public/puzzles.json` (GitHub Actions)
- **Movie Data**: TMDB API (live search for autocomplete)
- **State**: 100% browser localStorage (no tracking, GDPR compliant)

## Quick Start

### 1. **For Deployment** → See [DEPLOYMENT.md](./DEPLOYMENT.md)

That guide covers:
- Getting a free TMDB API key
- Setting up Vercel in 5 minutes
- Auto-generating daily puzzles with GitHub Actions
- Configuring a custom domain

### 2. **For Local Development**

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Generate local puzzles (requires .env.local with VITE_TMDB_API_KEY)
npm run generate-puzzles

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sequencer.tsx       # 10-slot progress bar
│   ├── CastDisplay.tsx     # Actor image + info
│   ├── Autocomplete.tsx    # Movie search dropdown
│   └── EndScreen.tsx       # Results + share card
├── services/
│   └── tmdb.ts             # TMDB API client
├── types.ts                # TypeScript interfaces
├── utils.ts                # State management & helpers
├── App.tsx                 # Main game logic
├── main.tsx                # React entry point
└── index.css               # Global styles (Teenage Eng aesthetic)

scripts/
└── generatePuzzles.js      # Runs daily via GitHub Actions

public/
└── puzzles.json            # Generated daily (365 movies)

.github/workflows/
├── generate-puzzles.yml    # Daily puzzle generator (runs at 12:01 AM UTC)
└── deploy-vercel.yml       # Auto-deploy on push to main
```

## How to Play

1. **Open the game** at https://castreveal.game (or your deployed URL)
2. **See an actor** from today's mystery movie
3. **Guess the movie title** in the search bar
4. **Wrong guess?** → Next actor reveals (moving up the cast billing order)
5. **Correct guess?** → All 10 slots light up green, game ends
6. **Max 10 guesses** → The full title is revealed, game lost
7. **Share your score** via the emoji card

## Scoring System

| Guesses | Meaning |
|---------|---------|
| 1 | Perfect! Only the lead actor shown |
| 3-4 | Excellent |
| 7-8 | Good |
| 10 | Solved but challenging |

**Streaks**: Win consecutive days to build your streak (resets on loss).

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile (iOS Safari, Chrome Android)
- Minimum viewport: 320px (mobile optimized)

## Environment Variables

**Development (.env.local):**
```
VITE_TMDB_API_KEY=your_tmdb_read_only_api_key
```

**Production (Vercel):**
Set via Vercel dashboard:
- `VITE_TMDB_API_KEY` (from https://www.themoviedb.org/settings/api)

## Design System

- **Font**: `JetBrains Mono` / `Space Mono` (monospaced, technical)
- **Base Color**: `#111111` (matte off-black)
- **Accent**: `#FF4500` (signal orange)
- **Text**: `#F2F0EB` (cream/off-white)
- **Inspiration**: Teenage Engineering synth hardware aesthetic

## Performance

- **Load time**: < 100ms (Vercel CDN)
- **Image optimization**: TMDB w300 thumbnails
- **State mgmt**: localStorage (no network calls after load)
- **Traffic resilient**: Serverless scales infinitely

## Future Expansions

- 🔊 Synth sound effects on guess/reveal
- 🌓 Dark/Light theme variants
- 🎯 Hard mode (character names hidden)
- 🏆 Archive mode (play past days)
- 📊 Statistics dashboard (guess distribution chart)
- 🔗 Custom challenge rooms

## Tech Stack

- **React 18** with TypeScript
- **Vite** (bundler)
- **Axios** (HTTP client)
- **dotenv** (environment config)
- **Vercel** (deployment platform)
- **GitHub Actions** (CI/CD)
- **TMDB API** (movie data)

## License

MIT License — 2026

---

**👉 Ready to deploy?** Start with [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.
