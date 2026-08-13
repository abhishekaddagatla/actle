# What You Need to Do RIGHT NOW

Before you deploy, here's the checklist of what **requires your action** (not automated).

---

## 🔑 Step 1: Get Your TMDB API Key (5 min)

**This is essential and free.**

1. Go to: https://www.themoviedb.org/signup
2. Create account → Verify email
3. Log in → Settings → API
4. Copy your **API Key (v3 auth)**
5. Save it somewhere safe — you'll use it 3 times

---

## 📁 Step 2: Set Up Local Project (5 min)

Copy this exact sequence of commands:

```bash
# Navigate to your project
cd "C:\Users\abhia\OneDrive\Documents\myProjects\Actle"

# Install dependencies
npm install

# Create .env.local file with your API key
# On Windows, use this command:
echo VITE_TMDB_API_KEY=your_api_key_here > .env.local

# Replace 'your_api_key_here' with your actual TMDB key

# Test local build
npm run dev
```

**Expected output:** 
```
➜  Local:   http://localhost:3000/
```

You can stop the server with `Ctrl+C`.

---

## 🌐 Step 3: Create GitHub Repository (5 min)

1. Go to: https://github.com/new
2. Repository name: `cast-reveal`
3. **IMPORTANT: Set to PUBLIC** (required for free Vercel)
4. Create repository

Then run these commands:

```bash
# From your project folder (C:\Users\abhia\OneDrive\Documents\myProjects\Actle)

git init
git add .
git commit -m "Initial commit: Cast Reveal game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cast-reveal.git

# Replace YOUR_USERNAME with your actual GitHub username

git push -u origin main
```

**Verify:** Visit your GitHub repo and confirm all files are there.

---

## 🚀 Step 4: Deploy to Vercel (10 min)

1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize and sign in
4. Go to: https://vercel.com/dashboard
5. Click "Add New..." → "Project"
6. Select `cast-reveal` repository
7. **BEFORE DEPLOYING**, scroll down to "Environment Variables"
8. Add new variable:
   - **Name:** `VITE_TMDB_API_KEY`
   - **Value:** Your TMDB key
   - **Environments:** All (✓ Production, ✓ Preview, ✓ Development)
9. Click "Deploy"

**Watch for:** Build completes in 2-3 min. You'll get a URL like `https://cast-reveal.vercel.app`

**Expected:** Site loads but shows error about puzzles.json — that's NORMAL.

---

## 🎬 Step 5: Generate Puzzles (5 min)

Run from your local machine:

```bash
npm run generate-puzzles
```

**Expected output:**
```
✓ Successfully generated 365 puzzles
✓ Puzzles saved to: C:\...\public\puzzles.json
✓ Total puzzles generated: 365
```

Then commit and push:

```bash
git add public/puzzles.json
git commit -m "chore: add initial puzzles"
git push origin main
```

**Vercel auto-redeploys** in < 1 minute. Your site is now live! 🎉

---

## ⚙️ Step 6: Set Up GitHub Actions for Daily Puzzles (5 min)

These are the **only two places** you need to add secrets:

### Where 1: GitHub Secrets

1. Go to: https://github.com/YOUR_USERNAME/cast-reveal
2. Click **Settings** (repo settings)
3. Left sidebar → **Secrets and variables → Actions**
4. Click **"New repository secret"**
5. **Name:** `TMDB_API_KEY`
6. **Value:** Your TMDB API key (same one as before)
7. Click "Add secret"

### Where 2: Vercel Environment (Already Done!)

You already set `VITE_TMDB_API_KEY` in Step 4 — no need to repeat.

---

## 🎮 Step 7: Test Your Deployment (5 min)

1. Go to your Vercel URL: `https://cast-reveal.vercel.app`
2. You should see today's movie puzzle
3. Try typing a movie name (e.g., "Inception")
4. Click an autocomplete suggestion
5. Test wrong guess → next actor reveals
6. Try correct guess → all 10 slots go green
7. Complete a game and copy the share card

---

## ✅ Total Time Required: **30-45 minutes**

| Step | Time | What You Do |
|------|------|-----------|
| 1 | 5 min | Get TMDB API key (one-time) |
| 2 | 5 min | Install dependencies locally |
| 3 | 5 min | Create GitHub repo & push code |
| 4 | 10 min | Deploy to Vercel |
| 5 | 5 min | Generate puzzles & push |
| 6 | 5 min | Add GitHub secrets |
| 7 | 5 min | Test — done! |

---

## 🎯 That's It!

Your game is now:
- ✅ Live at `https://cast-reveal.vercel.app`
- ✅ Auto-updating daily puzzles (TODO: verify this runs tomorrow at 12:01 AM UTC)
- ✅ Handling infinite traffic (Vercel CDN)
- ✅ Costing $0

**Tomorrow at 12:01 AM UTC**, GitHub Actions will automatically:
1. Generate 10 new puzzles from TMDB
2. Update `public/puzzles.json`
3. Push to GitHub
4. Vercel auto-deploys
5. Your users get new puzzles (zero downtime)

---

## 🚀 Optional: Custom Domain

If you own a domain (e.g., `castreveal.game`):

1. Vercel dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records in your domain registrar
4. Done in 24-48 hours

---

## ❓ Need Help?

- **Local dev issues:** Read [README.md](./README.md)
- **Deployment deep dive:** Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Step-by-step guide:** Read [SETUP.md](./SETUP.md)

---

**You're ready to go. Start with Step 1! 🎬**
