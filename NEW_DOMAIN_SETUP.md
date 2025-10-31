# 🔧 New Domain Setup - code-verse-pi.vercel.app

## 🚨 Current Issue

HTTP 500 error on `/api/auth/error` - Domain changed from `code-verse-alpha.vercel.app` to `code-verse-pi.vercel.app`

## ✅ Fixes Applied

1. ✅ Created `/app/auth/error/page.tsx` - Error page was missing
2. ✅ Added error handling in `app/api/auth/[...nextauth]/route.ts`
3. ✅ Better error responses instead of crashes

## 📋 CRITICAL: Update Environment Variables

### Vercel Dashboard → Settings → Environment Variables

**NEW Domain ke liye update karo (Production environment):**

```
NEXTAUTH_URL=https://code-verse-pi.vercel.app
NEXT_PUBLIC_APP_URL=https://code-verse-pi.vercel.app
AUTH_SECRET=<same_secret>
AUTH_GITHUB_ID=<same_github_id>
AUTH_GITHUB_SECRET=<same_github_secret>
AUTH_GOOGLE_ID=<same_google_id>
AUTH_GOOGLE_SECRET=<same_google_secret>
MONGODB_URI=<same_mongodb_uri>
```

**⚠️ Important:**
- Environment: **Production** select karo
- `NEXTAUTH_URL` update karo: `https://code-verse-pi.vercel.app`
- `NEXT_PUBLIC_APP_URL` update karo: `https://code-verse-pi.vercel.app`

## 🔵 Update GitHub OAuth Settings

1. Go to: [github.com/settings/developers](https://github.com/settings/developers)
2. Your OAuth App → Settings

**Update these:**
- **Homepage URL:** `https://code-verse-pi.vercel.app`
- **Authorization callback URL:** `https://code-verse-pi.vercel.app/api/auth/callback/github`

3. Click **"Update application"**

## 🟢 Update Google OAuth Settings

1. Go to: [console.cloud.google.com](https://console.cloud.google.com)
2. Project → APIs & Services → Credentials
3. Your OAuth 2.0 Client ID

**Add/Update these:**
- **Authorized JavaScript origins:** `https://code-verse-pi.vercel.app`
- **Authorized redirect URIs:** `https://code-verse-pi.vercel.app/api/auth/callback/google`

4. Click **"SAVE"**

## 🚀 After Updates

1. **Redeploy on Vercel** (after updating env vars)
2. **Wait 2-3 minutes**
3. **Test:** `https://code-verse-pi.vercel.app/sign-in`

---

## 📝 Quick Checklist

- [ ] Vercel env vars updated for `code-verse-pi.vercel.app` (Production)
- [ ] GitHub OAuth callback URL updated
- [ ] Google OAuth redirect URI updated
- [ ] Redeployed on Vercel
- [ ] Tested OAuth login

---

**Ye sab update karne ke baad OAuth kaam karega! 🎉**

