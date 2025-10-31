# 🚀 Quick Start - GitHub & Vercel Setup

## Step 1: Clean Repository (IMPORTANT!)

Before pushing to GitHub, ensure sensitive files are not tracked:

```bash
# Check what will be committed
git status

# If you see .env, temp.env, or repomix-output.xml, remove them:
git rm --cached .env temp.env repomix-output.xml 2>$null

# Or if git is not initialized yet, just make sure they're in .gitignore
```

## Step 2: Create GitHub Repository

1. Go to GitHub and create a new repository
2. Don't initialize with README (we already have one)

## Step 3: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect Next.js ✅

### 4.2 Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

#### 🔴 Required:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/codeverse
AUTH_SECRET=<generate_32_char_secret>
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

#### 🟡 OAuth (if using):
```
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

#### 🟢 Optional (AI features):
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### 4.3 Generate AUTH_SECRET

Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as `AUTH_SECRET`.

### 4.4 Deploy

Click **"Deploy"** and wait 2-3 minutes! 🎉

## Step 5: Configure OAuth Callbacks

After first deployment, update OAuth callback URLs:

### GitHub:
- Settings → Developer settings → OAuth Apps
- Add: `https://your-app.vercel.app/api/auth/callback/github`

### Google:
- Google Cloud Console → Credentials
- Add: `https://your-app.vercel.app/api/auth/callback/google`

## ✅ Done!

Your app is live at `https://your-app-name.vercel.app`

---

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.

