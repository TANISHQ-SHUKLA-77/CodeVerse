# 🔐 OAuth Setup for Production

## Production URL
**Your App:** `https://code-verse-alpha.vercel.app`

---

## 🔵 GitHub OAuth Setup

### Step 1: Go to GitHub OAuth Settings
1. Go to: [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → Select your app (or create new)

### Step 2: Update URLs
In your OAuth App settings, update these fields:

**Homepage URL:** ⚠️ **UPDATE THIS!**
```
https://code-verse-alpha.vercel.app
```
(Change from `http://localhost:3000` to production URL)

**Authorization callback URL:** ✅ Already correct!
```
https://code-verse-alpha.vercel.app/api/auth/callback/github
```

### Step 3: Update Vercel Environment Variables
Make sure in Vercel dashboard, these are set:
- `NEXTAUTH_URL=https://code-verse-alpha.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app`

### Step 4: Save
Click **"Update application"**

---

## 🟢 Google OAuth Setup

### Step 1: Go to Google Cloud Console
1. Go to: [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click on your OAuth 2.0 Client ID

### Step 2: Update Authorized Redirect URIs
Add this redirect URI:

```
https://code-verse-alpha.vercel.app/api/auth/callback/google
```

**Important:** Make sure to:
- Click **"ADD URI"** after typing
- Click **"SAVE"** at the bottom

### Step 3: Verify Vercel Environment Variables
In Vercel dashboard, ensure:
- `NEXTAUTH_URL=https://code-verse-alpha.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app`

---

## ✅ Verification Checklist

After updating:

- [ ] GitHub callback URL added: `https://code-verse-alpha.vercel.app/api/auth/callback/github`
- [ ] Google redirect URI added: `https://code-verse-alpha.vercel.app/api/auth/callback/google`
- [ ] Vercel `NEXTAUTH_URL` = `https://code-verse-alpha.vercel.app`
- [ ] Vercel `NEXT_PUBLIC_APP_URL` = `https://code-verse-alpha.vercel.app`
- [ ] Redeploy on Vercel (if needed) after updating env vars

---

## 🧪 Testing

After setup:
1. Go to `https://code-verse-alpha.vercel.app/sign-in`
2. Click **"Log in with GitHub"** → Should redirect to GitHub and back
3. Click **"Log in with Google"** → Should redirect to Google and back

If errors occur, check:
- Callback URLs match exactly (no trailing slashes)
- Environment variables are set correctly in Vercel
- OAuth app credentials are correct

---

## 📝 Quick Reference

### GitHub Callback URL:
```
https://code-verse-alpha.vercel.app/api/auth/callback/github
```

### Google Redirect URI:
```
https://code-verse-alpha.vercel.app/api/auth/callback/google
```

### Vercel Environment Variables:
```
NEXTAUTH_URL=https://code-verse-alpha.vercel.app
NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app
```

