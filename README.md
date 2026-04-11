# FeelGood Connect — Super Admin UI

React-based Super Admin dashboard for the FeelGood platform. Allows super admins to review org registrations, manage users, volunteers, org reps, events, and organizations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + SWC |
| Routing | React Router v6 |
| State | Zustand (persisted) |
| UI | shadcn/ui + Tailwind CSS |
| HTTP | Axios |
| Backend | `https://api.feelgoodapp.net` |

---

## Prerequisites

- Node.js 18+ (use [nvm](https://github.com/nvm-sh/nvm))
- npm 9+

---

## Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd feelgood-connect

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env and fill in the required values

# 4. Start the dev server
npm run dev
```

App runs at: **http://localhost:8080**

The Vite dev server proxies all `/api/*` requests to `https://api.feelgoodapp.net` — no CORS issues locally.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. **Never commit `.env` to git.**

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Yes | Supabase project ID |
| `VITE_API_URL` | No | Override API base URL (leave blank for local proxy) |

For **production** (S3/CloudFront), set `VITE_API_URL=https://api.feelgoodapp.net` in your CI/build environment.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR on port 8080 |
| `npm run build` | Build for production (output: `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Admin Login

1. Open `http://localhost:8080/admin/login`
2. Enter your registered phone number
3. Enter the OTP received
4. Requires `superAdmin` role — access is denied for all other roles

---

## AWS S3 + CloudFront Deployment

```bash
# Build
npm run build

# Upload dist/ to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**CloudFront must be configured with a custom error response:**
- HTTP Error Code: `403` / `404`
- Response Page Path: `/index.html`
- HTTP Response Code: `200`

This ensures React Router client-side routes work on direct URL access or reload.

---

## Project Structure

```
src/
├── pages/
│   ├── admin/          # Super Admin pages (Dashboard, OrgRegistrations, Users, etc.)
│   ├── orgrep/         # Org Rep pages
│   └── volunteer/      # Volunteer pages
├── components/
│   ├── admin/          # AdminLayout, AdminProtectedRoute, OrgDetailSheet
│   └── ui/             # shadcn/ui base components
├── stores/
│   └── authStore.ts    # Zustand auth store (persisted to localStorage)
├── lib/
│   └── api.ts          # Axios instance with base URL, auth interceptors, 401 refresh
├── contexts/
│   └── AuthContext.tsx # Supabase session context (legacy routes)
└── integrations/
    └── supabase/       # Supabase client + generated types
```
