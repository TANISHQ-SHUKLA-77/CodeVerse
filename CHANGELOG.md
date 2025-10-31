# Changelog

All notable changes to this project will be documented in this file.

## [0.1.5] - 2025-10-31
### Added
- **Deployment Setup:** Complete Vercel deployment configuration
  - Updated `.gitignore` to exclude all sensitive files (env files, repomix, backups)
  - Created `.env.example` template for environment variables
  - Created `DEPLOYMENT.md` with step-by-step deployment guide
  - Created `QUICK_START.md` for quick deployment reference
  - Added pre-deploy check script (`npm run pre-deploy`)
  - Updated `vercel.json` with Turbopack support
  - Added `.vercelignore` for Vercel-specific ignores

### Fixed
- Ensured sensitive files are properly excluded from Git:
  - `.env`, `.env.local`, `.env.development`, `temp.env`
  - `repomix-output.xml`
  - `package.json.backup` and other backup files

## [0.1.4] - 2025-10-31
### Fixed
- **Vote functionality (Upvote/Downvote):** Fixed issues with voting system
  - Added userId ObjectId validation in vote actions (same fix as question submission)
  - Added optimistic UI updates for instant feedback
  - Fixed state management to properly track vote status
  - Removed authorization requirement for checking vote status (allows viewing votes without login)
  - Added router refresh after vote to sync with server state
- **Save/Star functionality:** Fixed star (save question) feature
  - Added userId ObjectId validation in collection actions
  - Added optimistic UI updates for instant feedback
  - Fixed state synchronization after save/unsave
  - Added proper error handling and state reversion on errors

## [0.1.3] - 2025-10-31
### Fixed
- **Image component errors:** Fixed "Image is missing required src property" errors
  - Added validation in `Metric` component to handle empty/undefined `imgUrl`
  - Added fallback to default placeholder image for authors without profile images
  - Image only renders when valid src is provided (prevents empty string errors)

### Performance
- **Turbopack enabled:** Switched from Webpack to Turbopack for faster development builds
  - Added `--turbo` flag to all dev scripts for significantly faster hot module replacement
  - Development server now starts much faster with improved compilation speed

## [0.1.2] - 2025-10-31
### Fixed
- **Question submission:** Fixed BSONError when submitting questions
  - Added validation to check if userId is a valid ObjectId format before conversion
  - Added fallback to lookup user by email if userId is in wrong format (handles OAuth provider IDs)
  - Fixed session callback to prioritize MongoDB ObjectId (token.id) over OAuth provider ID (token.sub)
  - Added revalidatePath calls after question creation for proper cache invalidation
- **AI generation:** Fixed server errors in AI question generation
  - Added Hugging Face free API as fallback when OPENAI_API_KEY is not configured
  - Improved error handling with graceful fallbacks
  - Returns helpful message if both APIs fail
- **MongoDB cleanup:** Added script to clear all database data
  - Created `scripts/clear-db.js` for easy database reset
  - Added `npm run clear-db` command

## [0.1.1] - 2025-10-31
### Fixed
- Resolved Next.js build failures caused by missing Suspense boundaries around components using `useSearchParams`.
  - Wrapped `Navbar` (via `app/(root)/layout.tsx`) with `<Suspense />` because it renders `GlobalSearch` (client) which uses `useSearchParams`.
  - Added `<Suspense />` boundaries on pages rendering client components: `app/(root)/page.tsx`, `app/(root)/community/page.tsx`.
- Corrected minor className typo in `CommonFilter` min-width utility on Community page.
- **Fixed OAuth authentication (Google & GitHub):**
  - Removed custom `redirect_uri` from GitHub provider (NextAuth handles this automatically).
  - Added `signIn` callback to automatically create users and accounts in MongoDB when signing in with OAuth.
  - Implemented dynamic imports for mongoose in auth callbacks to avoid Edge Runtime issues.
  - Added unique username generation from email for OAuth users.
  - Fixed AUTH_SECRET/NEXTAUTH_SECRET environment variable handling (supports both).
  - Configured mongoose as external package to avoid Edge Runtime conflicts.

### Performance
- Ensured client components that depend on URL params are isolated behind Suspense to avoid CSR bailouts and reduce blocking during rendering.
- Confirmed mongoose connection re-use to prevent redundant DB handshakes across requests.
- Optimized OAuth user creation with transaction support for data consistency.

### Build & Deployment
- Verified clean install and production build succeed locally (`npm ci && npm run build`).
- Confirmed `vercel.json` configuration (framework: nextjs, install/build/dev commands) is compatible with Vercel.
- Configured webpack to externalize mongoose for proper server-side bundling.

### Notes
- Environment variables required for production:
  - `MONGODB_URI`
  - `AUTH_SECRET`
  - `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (if GitHub OAuth enabled)
  - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (if Google OAuth enabled)
  - `NEXTAUTH_URL` (Vercel URL)
  - `NEXT_PUBLIC_APP_URL` (public site URL)

---

## [0.1.0] - 2025-10-31
- Initial baseline as found in repository.
