---
description: Deploy the website to Vercel
---

# Deploy to Vercel

## Step 1: Build and test locally
```bash
npm run build
npm run preview
```
Test the preview at http://localhost:4173 to ensure everything works.

## Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 3: Login to Vercel
```bash
vercel login
```

## Step 4: Deploy
// turbo
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (select your account)
- Link to existing project? **N**
- What's your project's name? (press Enter for default)
- In which directory is your code located? **.**
- Want to override settings? **N**

## Step 5: Deploy to production
// turbo
```bash
vercel --prod
```

Your site will be live at the URL shown!

---

# Alternative: Deploy via Git + Vercel Dashboard

1. Push your code to GitHub
2. Visit https://vercel.com/new
3. Import your repository
4. Click "Deploy"

No configuration needed - Vercel auto-detects Vite!
