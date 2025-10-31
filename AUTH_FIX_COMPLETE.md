# ✅ Authentication Fix - Complete Guide

## 🔧 Code Fixes Applied

### 1. **Base URL Configuration** ✅
Added explicit base URL handling in `lib/auth-config.ts`:
- `getBaseUrl()` function added to properly detect production URL
- `url: getBaseUrl()` added to authOptions
- `basePath: '/api/auth'` explicitly set

### 2. **Environment Variable Priority** ✅
Base URL detection priority:
1. `NEXTAUTH_URL` (highest priority)
2. `NEXT_PUBLIC_APP_URL` (fallback)
3. `VERCEL_URL` (Vercel auto-detection)
4. `localhost:3000` (development only)

---

## 📋 Vercel Environment Variables (CRITICAL!)

**⚠️ MUST be set in Vercel Dashboard:**

```
NEXTAUTH_URL=https://code-verse-alpha.vercel.app
NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app
AUTH_SECRET=<your_secret_here>
AUTH_GITHUB_ID=<your_github_client_id>
AUTH_GITHUB_SECRET=<your_github_client_secret>
AUTH_GOOGLE_ID=<your_google_client_id>
AUTH_GOOGLE_SECRET=<your_google_client_secret>
MONGODB_URI=<your_mongodb_uri>
```

**Important:**
- ✅ Environment: **Production** select karo (not Development/Preview)
- ✅ All variables Production environment mein honi chahiye
- ✅ No trailing slashes in URLs
- ✅ Must be `https://` not `http://`

---

## 🔵 GitHub OAuth Verification

### In GitHub OAuth App Settings:
- **Homepage URL:** `https://code-verse-alpha.vercel.app`
- **Authorization callback URL:** `https://code-verse-alpha.vercel.app/api/auth/callback/github`

### Verify:
1. Go to: [github.com/settings/developers](https://github.com/settings/developers)
2. Your OAuth App → Check URLs match exactly
3. Client ID should match Vercel `AUTH_GITHUB_ID`
4. Client Secret should match Vercel `AUTH_GITHUB_SECRET`

---

## 🟢 Google OAuth Verification

### In Google Cloud Console:
- **Authorized JavaScript origins:** `https://code-verse-alpha.vercel.app`
- **Authorized redirect URIs:** `https://code-verse-alpha.vercel.app/api/auth/callback/google`

### Verify:
1. Go to: [console.cloud.google.com](https://console.cloud.google.com)
2. Project: `codeverse-476205` (or your project)
3. APIs & Services → Credentials → Your OAuth 2.0 Client ID
4. Client ID should match Vercel `AUTH_GOOGLE_ID`
5. Client Secret should match Vercel `AUTH_GOOGLE_SECRET`

---

## 🚀 Deployment Steps

### Step 1: Commit Code Changes
```bash
git add .
git commit -m "Fix: Add explicit base URL configuration for OAuth"
git push
```

### Step 2: Verify Vercel Environment Variables
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all required variables are set
3. **Production** environment selected
4. If missing, add them now

### Step 3: Redeploy
1. Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment
3. Wait for build (2-3 minutes)

### Step 4: Test
1. Go to: `https://code-verse-alpha.vercel.app/sign-in`
2. Test GitHub login
3. Test Google login

---

## 🧪 Testing Checklist

After redeploy, test these:

- [ ] **GitHub OAuth:**
  - Click "Log in with GitHub"
  - Should redirect to GitHub
  - After authorization, should redirect back to app
  - Should successfully sign in

- [ ] **Google OAuth:**
  - Click "Log in with Google"
  - Should redirect to Google
  - After authorization, should redirect back to app
  - Should successfully sign in

- [ ] **Error Pages:**
  - Invalid OAuth should show error page, not crash
  - Auth errors should be handled gracefully

---

## 🔍 Troubleshooting

### Issue: Still showing localhost redirect URI

**Solution:**
1. Double-check `NEXTAUTH_URL` in Vercel (Production environment)
2. Delete and re-add `NEXTAUTH_URL` variable
3. Redeploy
4. Wait 2-3 minutes after redeploy
5. Clear browser cache and try again

### Issue: Google "invalid_client" error

**Solution:**
1. Verify Client ID in Google Console matches Vercel `AUTH_GOOGLE_ID`
2. Verify Client Secret matches Vercel `AUTH_GOOGLE_SECRET`
3. Check JavaScript origins includes production URL
4. Check redirect URIs includes production callback URL
5. Ensure no typos or extra spaces

### Issue: GitHub "redirect_uri not associated" error

**Solution:**
1. Verify callback URL in GitHub exactly matches: 
   `https://code-verse-alpha.vercel.app/api/auth/callback/github`
2. No trailing slashes
3. Must be `https://` not `http://`
4. Wait 1-2 minutes after updating (GitHub caches settings)

---

## 📝 Code Changes Summary

### File: `lib/auth-config.ts`

**Added:**
```typescript
// Get base URL from environment or construct from headers
function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
```

**Updated:**
```typescript
export const authOptions: NextAuthConfig = {
  basePath: '/api/auth',
  // ... providers ...
  url: getBaseUrl(),  // Explicitly set base URL
  // ... rest of config ...
};
```

---

## ✅ Final Checklist

Before testing:
- [ ] Code changes committed and pushed
- [ ] Vercel environment variables verified (Production)
- [ ] `NEXTAUTH_URL` = `https://code-verse-alpha.vercel.app`
- [ ] GitHub OAuth settings verified
- [ ] Google OAuth settings verified
- [ ] Redeployed on Vercel
- [ ] Waited 2-3 minutes after redeploy

---

**After all fixes, OAuth should work perfectly! 🎉**

If still having issues:
1. Check Vercel build logs for errors
2. Check browser console for errors
3. Verify environment variables one more time
4. Ensure OAuth apps are not disabled

