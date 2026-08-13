# CAST REVEAL 🎬 — Deployment & Setup Guide

A serverless, zero-cost, infinitely scalable daily movie puzzle game built with React. Guess the movie by revealing actors from supporting cast to lead.

## Architecture Overview

```
GitHub Repository
    ↓
    ├─→ React App (Vercel)
    │   └─ Serves static HTML/CSS/JS
    │   └ Reads /public/puzzles.json
    │   └ Calls TMDB API for live search
    │
    └─→ GitHub Actions (Daily Job)
        └─ Runs puzzle generator
        └─ Fetches 365 movies from TMDB
        └─ Commits puzzles.json to repo
        └─ Triggers Vercel deployment
```

---

## Part 1: Essential Setup (15 min)

### 1.1 TMDB API Key (Free)

1. Go to **https://www.themoviedb.org/signup**
2. Create a free account
3. Navigate to **Settings → API**
4. Copy your **read-only API key** (under "API Key (v3 auth)")
5. **Save this value** — you'll use it in steps 1.3 and 2.5

### 1.2 Create GitHub Repository

1. **If you don't have one yet:**
   - Go to https://github.com/new
   - Name it `cast-reveal` (or your preference)
   - Set to **Public** (required for free Vercel)
   - Create repo

2. **Push this code to GitHub:**
   ```bash
   cd /path/to/Actle
   git init
   git add .
   git commit -m "Initial commit: React Cast Reveal game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cast-reveal.git
   git push -u origin main
   ```

### 1.3 Add .env.local (Local Development Only)

Create a `.env.local` file in the project root:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Replace `your_tmdb_api_key_here` with the key from Step 1.1.

---

## Part 2: Vercel Deployment (5 min)

### 2.1 Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub

### 2.2 Create Project in Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Select your `cast-reveal` GitHub repository
4. Click **"Import"**

### 2.3 Configure Environment Variable

1. Before deploying, go to **Project Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `VITE_TMDB_API_KEY`
   - **Value:** Your TMDB API key from Step 1.1
   - **Environments:** All (Production, Preview, Development)
3. Click **"Add"**

### 2.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy automatically
3. You'll get a URL like: `https://cast-reveal.vercel.app`
4. **Test it:** Open the URL in your browser

> **Note:** On first load, it will fail to find `puzzles.json` because we haven't generated it yet. That's normal—move to Part 3.

---

## Part 3: GitHub Actions — Auto Daily Puzzle Generation (5 min)

### 3.1 Add TMDB_API_KEY Secret to GitHub

1. Go to your GitHub repository
2. **Settings → Secrets and Variables → Actions**
3. Click **"New repository secret"**
4. **Name:** `TMDB_API_KEY`
5. **Value:** Your TMDB API key
6. Click **"Add secret"**

### 3.2 Create Initial puzzles.json

Before the GitHub Action runs, generate an initial puzzle file locally:

```bash
# Install dependencies
npm install

# Generate puzzles (will use .env.local API key)
npm run generate-puzzles
```

This creates `public/puzzles.json`. Commit and push to GitHub:

```bash
git add public/puzzles.json
git commit -m "chore: add initial puzzles"
git push
```

Vercel will automatically redeploy with the puzzles.json file!

### 3.3 Verify GitHub Actions Workflow

1. Go to your GitHub repo
2. Click **Actions**
3. You should see the `Generate Daily Puzzles` workflow
4. It's scheduled to run daily at 12:01 AM UTC
5. To test manually, click the workflow → **Run workflow** → **Run workflow**

---

## Part 4: Vercel Continuous Deployment (Optional but Recommended)

To automatically deploy when the puzzle generator pushes new puzzles:

### 4.1 Get Vercel Tokens

1. Go to https://vercel.com/account/tokens
2. Create a **New Token** (type: automation preferred)
3. Copy the token and save it

### 4.2 Add Vercel Secrets to GitHub

1. Go to **GitHub Settings → Secrets and Variables → Actions**
2. Add three new secrets:

   | Name | Value |
   |------|-------|
   | `VERCEL_TOKEN` | Your Vercel token from 4.1 |
   | `VERCEL_ORG_ID` | Go to https://vercel.com/account, copy the ID from url bar or under your account |
   | `VERCEL_PROJECT_ID` | Go to Vercel project settings, copy the ID |

3. Click **"Add secret"** for each one

### 4.3 The Deploy Workflow

The `.github/workflows/deploy-vercel.yml` already exists and will:
- Trigger whenever you push to `main`
- Automatically deploy to Vercel
- The puzzle generator will also trigger this deployment

---

## Part 5: Custom Domain (Optional)

### 5.1 In Vercel

1. Go to your Vercel project
2. **Settings → Domains**
3. Add your domain (e.g., `castreveal.game`)
4. Follow DNS setup instructions

### 5.2 In Domain Registrar

Update your domain's DNS records to point to Vercel (Vercel provides the exact records to add).

---

## Local Development

### Start Development Server

```bash
npm install
npm run dev
```

Opens at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
cast-reveal/
├── src/
│   ├── components/        # React components
│   ├── services/          # TMDB API integration
│   ├── App.tsx            # Main app component
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utilities & localStorage
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
├── scripts/
│   └── generatePuzzles.js # Puzzle generator script
├── public/
│   └── puzzles.json       # Generated daily (DO NOT EDIT MANUALLY)
├── .github/workflows/
│   ├── generate-puzzles.yml  # Daily puzzle generation
│   └── deploy-vercel.yml     # Continuous deployment
├── .env.example           # Template for .env.local
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── vercel.json            # Vercel configuration
```

---

## Troubleshooting

### "Failed to load puzzles.json"

**Solution:** The puzzle file hasn't been generated yet.
- Run `npm run generate-puzzles` locally
- Commit and push `public/puzzles.json` to GitHub
- Vercel will auto-redeploy

### GitHub Action fails with "TMDB_API_KEY not found"

**Solution:** Did you add the secret to GitHub?
1. Go to **Settings → Secrets and Variables → Actions**
2. Ensure `TMDB_API_KEY` exists with your API key
3. Re-run the workflow manually

### "VITE_TMDB_API_KEY is undefined" on live site

**Solution:** Environment variable not set in Vercel.
1. Go to Vercel **Project Settings → Environment Variables**
2. Verify `VITE_TMDB_API_KEY` is set
3. Redeploy the project

### Vercel deployment failed

**Solution:** Check the build logs in Vercel dashboard.
- Ensure `public/puzzles.json` exists in the repo
- Verify all dependencies install correctly: `npm install`
- Check that TypeScript compiles: `npm run build` locally first

---

## Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to Vercel project **Analytics**
2. Real-time traffic and performance metrics
3. 100% visibility into user experience

### Optional: Plausible Analytics (Privacy-Friendly)

1. Sign up at https://plausible.io (€9/month)
2. Add tracking code to `index.html`
3. Zero cookie banners, GDPR compliant

---

## Performance Optimization

- **puzzles.json** is cached globally by Vercel CDN
- **TMDB images** use optimized sizes (w300, w185, etc.)
- **React** is pre-optimized for fast loads
- **Mobile-first design** ensures fast rendering on 4G

---

## Key Takeaways

✅ **Zero cost to host** (Vercel free tier)  
✅ **Handles traffic spikes** (CDN + serverless)  
✅ **Auto-deploys daily puzzles** (GitHub Actions)  
✅ **5-minute setup** for production  
✅ **Full TypeScript** for safe development  
✅ **Privacy-first architecture** (no backend tracking)

---

## FAQ

**Q: Do I need a credit card for Vercel?**  
A: Not for the free tier. Upgrade later if you hit limits (unlikely for a game).

**Q: Can I change the puzzle generation schedule?**  
A: Yes! Edit `.github/workflows/generate-puzzles.yml` and change the cron time.

**Q: What if TMDB API changes?**  
A: The script is robust and will skip movies with incomplete data.

**Q: Can I use a different database for puzzles?**  
A: Yes! Simply replace the `puzzles.json` fetch with any API or database.

---

**🚀 You're all set!** Your game is now live and will auto-update with new puzzles every day.
