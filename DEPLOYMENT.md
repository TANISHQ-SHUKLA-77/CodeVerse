# 🚀 Vercel Deployment Guide

This guide will help you deploy CodeVerse to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB database (MongoDB Atlas recommended)
- OAuth app credentials (GitHub/Google)

## Step 1: Prepare Repository

### 1.1 Clean up sensitive files

Make sure these files are NOT committed to GitHub:
- `.env`
- `.env.local`
- `.env.development`
- `temp.env`
- `repomix-output.xml`
- `package.json.backup`

These should already be in `.gitignore`. Verify by running:
```bash
git status
```

If any sensitive files show up, they might already be tracked. Remove them:
```bash
git rm --cached .env.local temp.env repomix-output.xml
```

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js framework

### 3.2 Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
AUTH_SECRET=generate_using_openssl_rand_base64_32
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

#### OAuth Variables (if using):

```
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

#### Optional AI Variables:

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

### 3.3 Generate AUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3.4 Configure OAuth Callbacks

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Add callback URL: `https://your-app-name.vercel.app/api/auth/callback/github`

#### Google OAuth:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

## Step 4: Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-app-name.vercel.app`

## Step 5: Post-Deployment

### 5.1 Update OAuth Callback URLs

After first deployment, update OAuth callback URLs with your actual Vercel URL.

### 5.2 Test the Application

- [ ] Sign up/Sign in works
- [ ] OAuth (GitHub/Google) works
- [ ] Questions can be created
- [ ] Voting works
- [ ] Save/Star works
- [ ] AI generation works (if configured)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check that all dependencies are in `package.json`
- Run `npm install` locally and verify

**Error: Environment variable missing**
- Verify all required env vars are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)

### Runtime Errors

**MongoDB Connection Failed**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow all IPs or add Vercel IPs)
- Verify database name matches

**OAuth Not Working**
- Verify callback URLs match exactly in provider settings
- Check `NEXTAUTH_URL` matches your Vercel domain
- Ensure OAuth credentials are correct

**Build Too Slow**
- This is normal for first build
- Subsequent builds will be faster with caching

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/codeverse` |
| `AUTH_SECRET` | ✅ Yes | NextAuth secret key | `random_base64_string_32_chars` |
| `NEXTAUTH_URL` | ✅ Yes | Your production URL | `https://codeverse.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Public app URL | `https://codeverse.vercel.app` |
| `AUTH_GITHUB_ID` | ❌ No | GitHub OAuth Client ID | `Ov23li5x4xZ9suxVK7lk` |
| `AUTH_GITHUB_SECRET` | ❌ No | GitHub OAuth Secret | `...` |
| `AUTH_GOOGLE_ID` | ❌ No | Google OAuth Client ID | `...apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | ❌ No | Google OAuth Secret | `GOCSPX-...` |
| `OPENAI_API_KEY` | ❌ No | OpenAI API key for AI features | `sk-...` |
| `OPENAI_MODEL` | ❌ No | OpenAI model to use | `gpt-4o-mini` |

## MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: Add `0.0.0.0/0` (allow all) or specific Vercel IPs
5. Get connection string: Cluster → Connect → Connect your application
6. Replace `<password>` with your database user password

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Check MongoDB connection status

---

**Note:** Never commit `.env` files to Git. Always use Vercel's environment variables dashboard.

