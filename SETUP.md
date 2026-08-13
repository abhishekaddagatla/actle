# CAST REVEAL — Pre-Deployment Setup Checklist

Complete these steps **before** deploying. We've organized them into 5 quick phases.

---

## ✅ Phase 1: Local Environment Setup (10 min)

### 1.1 Install Dependencies

From the project directory:

```bash
npm install
```

This installs React, Vite, TypeScript, and all required packages.

### 1.2 Create .env.local File

In the project root, create a file named `.env.local`:

```bash
# .env.local
VITE_TMDB_API_KEY=paste_your_api_key_here
```

You'll fill in the API key in the next phase.

### 1.3 Test Local Build

```bash
# Start dev server
npm run dev

# You should see:
# ➜  Local:   http://localhost:3000/
```

Don't worry if it fails to load puzzles yet — we'll generate those next.

---

## ✅ Phase 2: Get TMDB API Key (5 min)

### 2.1 Register at TMDB

1. Go to **https://www.themoviedb.org/signup**
2. Create a free account
3. Verify your email

### 2.2 Generate API Key

1. Log in to TMDB
2. Go to **Settings → API** (in your profile)
3. Click **"Create"** or **"Request an API Key"**
4. Select **"Developer"** (for personal use)
5. Accept the terms
6. You'll see your **API Key (v3 auth)** — copy it

### 2.3 Update .env.local

```bash
# .env.local
VITE_TMDB_API_KEY=abc123xyz456...  # Your actual key
```

### 2.4 Verify It Works

```bash
# Generate sample puzzles locally
npm run generate-puzzles

# Should output:
# ✓ Successfully generated 365 puzzles
# ✓ Puzzles saved to: /path/to/public/puzzles.json
```

---

## ✅ Phase 3: Push Code to GitHub (5 min)

### 3.1 Initialize Git Repo

```bash
cd /path/to/Actle
git init
git add .
git commit -m "Initial commit: React Cast Reveal"
```

### 3.2 Create GitHub Repository

1. Go to **https://github.com/new**
2. Name: `cast-reveal` (or your preference)
3. Description: "Daily movie puzzle game"
4. **Important**: Set to **Public** (required for free Vercel)
5. Click **"Create repository"**

### 3.3 Connect Local Repo to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cast-reveal.git
git push -u origin main

# Replace YOUR_USERNAME with your actual GitHub username
```

### 3.4 Verify

1. Go to **https://github.com/YOUR_USERNAME/cast-reveal**
2. You should see all your files (src/, scripts/, public/, etc.)

---

## ✅ Phase 4: Set Up Vercel Deployment (10 min)

### 4.1 Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

### 4.2 Import Project

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..." → "Project"**
3. Find `cast-reveal` in your GitHub repos
4. Click **"Import"**

### 4.3 Add Environment Variables

**Before clicking "Deploy"**, configure the environment variable:

1. Scroll down to **"Environment Variables"**
2. Add new variable:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: Your TMDB API key (from Phase 2)
   - **Environments**: Select all (Production, Preview, Development)
3. Click **"Add"**

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL: `https://cast-reveal.vercel.app`
4. Open it in your browser

**Note:** It will show an error about missing `puzzles.json` — that's normal. We'll fix this next.

---

## ✅ Phase 5: Set Up Daily Puzzle Generation (10 min)

### 5.1 Add TMDB_API_KEY to GitHub Secrets

1. Go to **https://github.com/YOUR_USERNAME/cast-reveal**
2. Click **Settings** (repo settings, not your profile)
3. Left sidebar → **Secrets and variables → Actions**
4. Click **"New repository secret"**
5. **Name**: `TMDB_API_KEY`
6. **Value**: Your TMDB API key (same as Phase 4.3)
7. Click **"Add secret"**

### 5.2 Generate Initial Puzzles

```bash
# From your local machine
npm run generate-puzzles

# This creates: public/puzzles.json (365 movies)
```

### 5.3 Commit and Push Puzzles

```bash
git add public/puzzles.json
git commit -m "chore: add initial puzzle data"
git push origin main
```

Vercel will **auto-redeploy** within seconds!

### 5.4 Test on Live Site

1. Go to **https://cast-reveal.vercel.app**
2. Should now show today's puzzle
3. Try guessing a movie title
4. Test the autocomplete search
5. Complete a puzzle and share the result

### 5.5 Verify GitHub Actions

1. Go to **https://github.com/YOUR_USERNAME/cast-reveal**
2. Click **Actions** tab
3. You should see **"Generate Daily Puzzles"** workflow
4. It's scheduled to run **daily at 12:01 AM UTC**
5. To test manually: Select the workflow → **Run workflow** → **Run workflow**

---

## ✅ Optional: Custom Domain (5 min)

### Option A: Vercel Domain (Easiest)

1. Go to Vercel project dashboard
2. **Settings → Domains**
3. Enter your domain (e.g., `castreveal.game`)
4. Follow instructions to verify DNS

### Option B: Existing Domain

If you already own a domain (e.g., from Namecheap, GoDaddy):

1. In Vercel dashboard → **Settings → Domains**
2. Add your domain
3. Note the DNS records Vercel provides
4. Go to your domain registrar (e.g., Namecheap)
5. Update DNS settings to point to Vercel
6. Wait 24-48 hours for DNS to propagate

---

## ✅ Verification Checklist

By now, you should have:

- [ ] ✅ Cloned/set up the React project locally
- [ ] ✅ Installed dependencies (`npm install`)
- [ ] ✅ Created `.env.local` with TMDB API key
- [ ] ✅ Tested local dev server (`npm run dev`)
- [ ] ✅ Generated puzzles locally (`npm run generate-puzzles`)
- [ ] ✅ Pushed code to GitHub
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Set `VITE_TMDB_API_KEY` in Vercel environment
- [ ] ✅ Added `TMDB_API_KEY` to GitHub secrets
- [ ] ✅ Committed & pushed `public/puzzles.json`
- [ ] ✅ Game is live at your Vercel URL
- [ ] ✅ Verified GitHub Actions workflow exists
- [ ] ✅ (Optional) Configured custom domain

---

## Troubleshooting

### "npm install" fails

```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
```

### Dev server won't start (localhost:3000)

```bash
# Port already in use? Try a different port
npm run dev -- --port 3001
```

### TMDB API key not working

- Verify it's the **read-only v3 auth** key (not the bearer token)
- Check it's not expired or revoked in TMDB settings
- Ensure it's in both `.env.local` (local) and Vercel dashboard (production)

### Vercel deploy fails

1. Check build logs in Vercel dashboard
2. Ensure `public/puzzles.json` exists in repo
3. Verify all dependencies install: `npm install` locally first
4. Check that TypeScript compiles: `npm run build` locally

### GitHub Action fails to generate puzzles

1. Verify `TMDB_API_KEY` secret is set in GitHub
2. Check the action log for detailed error
3. Run manually: **Actions → Generate Daily Puzzles → Run workflow**

### Game shows "LOADING..." forever

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab — is `puzzles.json` loading?
4. Ensure `public/puzzles.json` was committed to GitHub

---

## Next Steps

**You're live!** 🚀

Your game is now:
- ✅ Live at: `https://cast-reveal.vercel.app`
- ✅ Auto-deploying on git push
- ✅ Auto-generating puzzles daily
- ✅ Immune to traffic spikes (serverless CDN)
- ✅ Costing $0/month

### Coming Soon:
- 🔊 Sound effects
- 🌓 Theme variants
- 📊 Statistics dashboard
- 🏆 Archive mode

Share your link with friends! 🎬

---

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deeper technical details.
