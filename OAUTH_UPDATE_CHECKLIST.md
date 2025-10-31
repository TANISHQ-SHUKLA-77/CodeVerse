# ✅ OAuth Update Checklist for code-verse-alpha.vercel.app

## 🔵 GitHub OAuth - What to Change

### ✅ Already Correct:
- **Authorization callback URL:** `https://code-verse-alpha.vercel.app/api/auth/callback/github` ✓

### ⚠️ NEEDS UPDATE:
- **Homepage URL:** Change from `http://localhost:3000` to:
  ```
  https://code-verse-alpha.vercel.app
  ```

### Steps:
1. **Homepage URL** field mein `https://code-verse-alpha.vercel.app` daalo
2. **Update application** button click karo
3. Done! ✅

---

## 🟢 Google OAuth - What to Add

### In Google Cloud Console:

1. Go to: [console.cloud.google.com](https://console.cloud.google.com)
2. Your project → **APIs & Services** → **Credentials**
3. Your OAuth 2.0 Client ID click karo
4. **Authorized redirect URIs** section mein add karo:

```
https://code-verse-alpha.vercel.app/api/auth/callback/google
```

5. **SAVE** button click karo

---

## ✅ Vercel Environment Variables

Vercel Dashboard → Settings → Environment Variables mein ye verify karo:

```
✅ NEXTAUTH_URL=https://code-verse-alpha.vercel.app
✅ NEXT_PUBLIC_APP_URL=https://code-verse-alpha.vercel.app
```

Agar nahi hain to add karo!

---

## 🧪 Test Karo

Update ke baad:
1. Go to: `https://code-verse-alpha.vercel.app/sign-in`
2. **GitHub** login try karo → Should work ✅
3. **Google** login try karo → Should work ✅

---

## 📝 Quick Summary

**GitHub:**
- Homepage URL: `https://code-verse-alpha.vercel.app` ⚠️ UPDATE THIS
- Callback URL: Already correct ✅

**Google:**
- Redirect URI: `https://code-verse-alpha.vercel.app/api/auth/callback/google` ➕ ADD THIS

