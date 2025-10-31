# 🔧 OAuth Fix Guide - Current Issues

## 🚨 Current Errors

1. **GitHub Error:** `redirect_uri` is not associated with this application
   - URL bar shows: `redirect_uri=http://localhost:3001/api/auth/callback/github`
   - Issue: Production site se localhost redirect URI call ho raha hai

2. **Google Error:** `invalid_client` - OAuth client was not found
   - Issue: Client ID ya configuration problem

---

## ✅ Fix Steps

### Step 1: Vercel Environment Variables (CRITICAL!)

Vercel Dashboard → Your Project → Settings → Environment Variables

**Ye variables MUST hain:**

```
NEXTAUTH_URL=https://code-verse-alpha.vercel.app
NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app
```

**⚠️ Important:**
- Environment select karo: **Production** (not Development or Preview)
- Agar already add hain, delete karke phir se add karo (clean setup)
- Redeploy karo after adding/updating variables

### Step 2: Verify GitHub OAuth Settings

1. Go to: [github.com/settings/developers](https://github.com/settings/developers)
2. Your OAuth App → Settings
3. **Check these EXACTLY match:**

**Homepage URL:**
```
https://code-verse-alpha.vercel.app
```

**Authorization callback URL:**
```
https://code-verse-alpha.vercel.app/api/auth/callback/github
```

**Important:**
- NO trailing slash (`/`)
- MUST be `https://` (not `http://`)
- EXACT match with Vercel URL

### Step 3: Verify Google OAuth Settings

1. Go to: [console.cloud.google.com](https://console.cloud.google.com)
2. Project → APIs & Services → Credentials
3. Your OAuth 2.0 Client ID

**Check these:**

**Authorized JavaScript origins:**
```
https://code-verse-alpha.vercel.app
```

**Authorized redirect URIs:**
```
https://code-verse-alpha.vercel.app/api/auth/callback/google
```

**Verify Client ID:**
- Copy your Client ID
- Vercel mein `AUTH_GOOGLE_ID` variable check karo
- Exact match hona chahiye

### Step 4: Redeploy on Vercel

After updating environment variables:

1. Go to Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment
3. Wait for build to complete (2-3 minutes)

---

## 🔍 Debug Checklist

### Vercel Environment Variables:
- [ ] `NEXTAUTH_URL` = `https://code-verse-alpha.vercel.app` (Production environment)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://code-verse-alpha.vercel.app` (Production environment)
- [ ] `AUTH_SECRET` is set
- [ ] `AUTH_GITHUB_ID` matches GitHub OAuth App
- [ ] `AUTH_GITHUB_SECRET` matches GitHub OAuth App
- [ ] `AUTH_GOOGLE_ID` matches Google Client ID
- [ ] `AUTH_GOOGLE_SECRET` matches Google Client Secret

### GitHub OAuth App:
- [ ] Homepage URL = `https://code-verse-alpha.vercel.app`
- [ ] Callback URL = `https://code-verse-alpha.vercel.app/api/auth/callback/github`
- [ ] Client ID matches Vercel `AUTH_GITHUB_ID`
- [ ] Client Secret matches Vercel `AUTH_GITHUB_SECRET`

### Google OAuth Client:
- [ ] JavaScript origin = `https://code-verse-alpha.vercel.app`
- [ ] Redirect URI = `https://code-verse-alpha.vercel.app/api/auth/callback/google`
- [ ] Client ID matches Vercel `AUTH_GOOGLE_ID`
- [ ] Client Secret matches Vercel `AUTH_GOOGLE_SECRET`

---

## 🎯 Most Common Issues

### Issue 1: localhost Redirect URI
**Symptom:** GitHub/Google error showing `localhost:3001` or `localhost:3000`

**Cause:** `NEXTAUTH_URL` Vercel mein set nahi hai ya wrong hai

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add/Update: `NEXTAUTH_URL=https://code-verse-alpha.vercel.app`
3. Environment: **Production** select karo
4. Redeploy

### Issue 2: Google Invalid Client
**Symptom:** "OAuth client was not found"

**Causes:**
- Client ID mismatch
- Client secret mismatch
- Wrong project selected
- Client disabled/deleted

**Fix:**
1. Google Cloud Console → Verify correct project selected
2. Check Client ID exactly matches Vercel `AUTH_GOOGLE_ID`
3. Regenerate Client Secret if needed
4. Update Vercel `AUTH_GOOGLE_SECRET`
5. Redeploy

### Issue 3: Redirect URI Mismatch
**Symptom:** "redirect_uri is not associated"

**Causes:**
- Callback URL in OAuth settings doesn't match exactly
- Trailing slash difference
- http vs https
- Wrong domain

**Fix:**
1. Copy exact URL from Vercel: `https://code-verse-alpha.vercel.app/api/auth/callback/github`
2. Paste in OAuth settings (exact match, no spaces)
3. Save
4. Wait 1-2 minutes (OAuth providers cache settings)
5. Try again

---

## 📝 Quick Verification Commands

After deployment, test these URLs:

```
https://code-verse-alpha.vercel.app/api/auth/signin
https://code-verse-alpha.vercel.app/api/auth/providers
```

Ye URLs properly work karni chahiye and show correct providers.

---

## ⚡ Quick Fix Summary

1. **Vercel Environment Variables:**
   ```
   NEXTAUTH_URL=https://code-verse-alpha.vercel.app
   NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app
   ```
   (Production environment mein add karo)

2. **Redeploy on Vercel**

3. **Wait 2-3 minutes** after redeploy

4. **Test again:** `https://code-verse-alpha.vercel.app/sign-in`

---

**Still not working?** 
- Check Vercel build logs for errors
- Verify environment variables are saved in Production environment
- Make sure no typos in URLs (copy-paste recommended)

