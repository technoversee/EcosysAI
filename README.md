# EcosysAI ♻️

> **AI-powered waste segregation assistant.** Snap a photo of any waste item — EcosysAI identifies the material, tells you which bin it goes in, and rewards you with real brand vouchers for disposing responsibly.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-llama--4--scout-F97316?logo=groq)](https://groq.com)
[![Turso](https://img.shields.io/badge/Turso-libSQL-4CC61E)](https://turso.tech)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)](https://ecosys-ai.vercel.app)

---

## Features

| Feature | Description |
|---|---|
| **AI Waste Recognition** | Snap a photo — Groq's `llama-4-scout-17b-16e-instruct` vision model identifies plastic, metal, glass, paper, or food waste with confidence scoring |
| **Live Camera Capture** | `getUserMedia()`-based camera with live preview; also supports uploading from gallery |
| **Disposal Guidance** | Per-material instructions, bin color, environmental impact, and practical tips |
| **Two-Phase Confirmation** | Classify identifies → confirm disposal → points awarded (no cheating) |
| **Point System** | Plastic = 10, Metal = 5, Glass = 5, Paper = 3, Food Waste = 2 points |
| **Real Brand Rewards** | Redeem points for Amazon Pay, Flipkart, Zomato, Swiggy, and Myntra vouchers (₹20–₹1,000) |
| **Growing Tree** | Your personal tree grows from seed → fully grown based on total points (5 stages) with grow animations, idle sway, and sparkles |
| **Leaderboard** | Live ranking of all users by total points with material breakdown |
| **Analytics Dashboard** | Real scan trends (weekly/monthly/yearly charts), material breakdown, streak tracking, CO₂ savings, personalized insights |
| **Achievements** | 13 unlockable badges — scan milestones, point thresholds, material-specific goals |
| **Dark Mode** | System-aware with manual toggle (sun/moon in topbar), persisted to localStorage, no flash |
| **Nature Background** | Rotating Unsplash nature photography with configurable overlay |
| **Notifications Panel** | Slide-out panel with live stats, milestones, and progress updates |
| **Google Sign-In** | One-click Google OAuth alongside email-only passwordless login |
| **Progressive Web App** | Works as an installable PWA with mobile-friendly bottom navigation |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16.2 (App Router) | React-based full-stack framework with file-based routing, server components, and API routes |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with custom design tokens |
| **Database** | Turso (libSQL) / SQLite | Serverless SQLite-over-HTTP in production; local SQLite file for development |
| **ORM / Driver** | `@libsql/client` | Async SQLite driver — same SQL syntax everywhere |
| **Authentication** | NextAuth v5 (Auth.js) | Credentials (email-only, auto-register) + Google OAuth |
| **AI / Vision** | Groq API | `meta-llama/llama-4-scout-17b-16e-instruct` — fast, free vision inference |
| **Fonts** | Fraunces + Inter via `next/font` | Serif headings, sans-serif body — optimized loading |
| **Icons** | Lucide React | Consistent open-source icon set |
| **Deployment** | Vercel | Automatic CI/CD from GitHub |

### Architecture

```
Browser ──→ Next.js (Vercel Edge/Serverless)
              │
              ├── API Routes ←→ @libsql/client ←→ Turso (prod) / SQLite (dev)
              │
              ├── NextAuth.js ←→ Google OAuth
              │
              └── Groq API (AI classification)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Groq API key](https://console.groq.com) (free tier available)
- (Optional) [Google OAuth credentials](https://console.cloud.google.com/apis/credentials) for Google sign-in

### Local Setup

```bash
git clone https://github.com/technoversee/EcosysAI.git
cd EcosysAI
npm install
```

Create a `.env.local` file at the project root:

```env
GROQ_API_KEY=gsk_your_groq_api_key
AUTH_SECRET=your_random_secret_at_least_32_chars
AUTH_URL=http://localhost:3000

# Google OAuth — optional, uncomment and fill in
# AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
# AUTH_GOOGLE_SECRET=your-google-client-secret
```

Generate a secure `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** SQLite database (`data/ecosysai.db`) is created automatically on first request. No migrations to run locally.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key for AI waste classification |
| `AUTH_SECRET` | ✅ | NextAuth encryption secret (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | ✅ | App base URL (`http://localhost:3000` for dev, `https://ecosys-ai.vercel.app` for production) |
| `AUTH_GOOGLE_ID` | Google OAuth | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth | Google OAuth client secret |
| `TURSO_DB_URL` | Production | Turso database URL (set only on Vercel) |
| `TURSO_DB_AUTH_TOKEN` | Production | Turso database auth token (set only on Vercel) |

---

## Deployment

### Vercel (Production)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables listed above in **Settings → Environment Variables**
4. Deploy — Vercel auto-deploys on every push to `main`

### Database (Turso)

Locally, EcosysAI uses a SQLite file (`data/ecosysai.db`). For Vercel deployment, you need a serverless database:

```bash
# Install Turso CLI
npm install -g turso

# Create a database
turso db create ecosysai

# Get the connection URL
turso db show ecosysai --url

# Generate an auth token
turso db create token ecosysai

# Seed the schema (copy the CREATE TABLE statements from src/lib/db.ts)
turso db shell ecosysai < data/schema.sql
```

Add `TURSO_DB_URL` and `TURSO_DB_AUTH_TOKEN` to Vercel environment variables. The app will automatically use Turso when these are present, and fall back to the local SQLite file otherwise.

> **Note:** `better-sqlite3` was previously used but has been replaced with `@libsql/client` which works natively in serverless environments. No native C++ modules required.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, theme init script, providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Design tokens, dark mode variables, animations
│   ├── login/
│   │   └── page.tsx            # Auth page — email login + Google OAuth
│   ├── api/
│   │   ├── auth/[...nextauth]  # NextAuth route handler
│   │   ├── classify/route.ts   # POST — classify waste image (no points yet)
│   │   ├── scans/
│   │   │   ├── confirm/route.ts # POST — confirm disposal, award points
│   │   │   └── trends/route.ts  # GET  — scan counts by week/month/year
│   │   ├── leaderboard/route.ts # GET  — top users + material breakdown
│   │   ├── redeem/route.ts      # POST — redeem points for a reward
│   │   └── proofs/
│   │       ├── route.ts         # GET/POST — proof submissions
│   │       └── [id]/route.ts    # PATCH — approve/reject proof (admin)
│   └── (app)/
│       ├── layout.tsx           # Authenticated app layout
│       ├── dashboard/page.tsx   # Dashboard — tree, chart, stats, achievements
│       ├── scan/page.tsx        # Scan flow — camera → result → guidance → confirm → celebrate
│       ├── leaderboard/page.tsx # Leaderboard rankings
│       ├── rewards/page.tsx     # Brand voucher marketplace
│       ├── analytics/page.tsx   # Trend charts, material breakdown, insights
│       ├── profile/page.tsx     # User profile with tree + achievements
│       ├── settings/page.tsx    # Dark mode, nature background, notification toggles
│       └── admin/page.tsx       # Proof review panel
├── components/
│   ├── AppLayout.tsx            # Auth guard + shell (sidebar, topbar, nav, notifications)
│   ├── AppSidebar.tsx           # Desktop sidebar navigation
│   ├── AppTopbar.tsx            # Top bar — dark mode toggle, notification bell, avatar menu
│   ├── AppBottomNav.tsx         # Mobile bottom navigation
│   ├── AppNotifications.tsx     # Slide-out notifications panel
│   ├── TreeAnimation.tsx        # Living tree — grow animation, sway, sparkles, progress bar
│   ├── NatureBackground.tsx     # Rotating Unsplash backgrounds
│   ├── NotificationBanner.tsx   # Cycling waste facts banner
│   ├── ScanFab.tsx              # Floating scan button (mobile)
│   └── Providers.tsx            # NextAuth session provider
└── lib/
    ├── db.ts                    # Database client (Turso/SQLite) + schema initialization
    ├── auth.ts                  # NextAuth configuration
    ├── groq.ts                  # Groq API wrapper for image classification
    └── constants.ts             # Points, tree stages, rewards, achievements, material info, waste facts
```

---

## API Reference

All API routes are prefixed with `/api`. Auth-protected routes require a valid NextAuth session cookie.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/callback/credentials` | No | Email-only sign-in (auto-registers if new) |
| `POST` | `/api/auth/callback/google` | No | Google OAuth sign-in |
| `GET` | `/api/auth/session` | No | Get current session |
| `POST` | `/api/classify` | Yes | Upload waste image → AI classification result (no points awarded) |
| `POST` | `/api/scans/confirm` | Yes | Confirm disposal → award points to user |
| `GET` | `/api/scans/trends?range=week\|month\|year` | Yes | Scan count time series for charts |
| `GET` | `/api/leaderboard` | No | Top 50 users by points + material breakdown |
| `POST` | `/api/redeem` | Yes | Redeem points for a reward voucher |
| `GET` | `/api/proofs` | No | List proof submissions (admin) |
| `POST` | `/api/proofs` | Yes | Submit a disposal proof photo |
| `PATCH` | `/api/proofs/[id]` | No | Approve/reject proof (admin) |

### Classification → Points Flow

```
[Snap photo] → POST /api/classify → { material, confidence, tips, pointsAwarded, scanId }
                                                      ↓
                                     User disposes item correctly
                                                      ↓
                              POST /api/scans/confirm { scanId }
                                                      ↓
                              { success, pointsAwarded, totalPoints }
                              → celebration animation + counter + badge check
```

Points are **only** awarded on confirmation, not on classification. This ensures users actually dispose of items before earning rewards.

---

## Database Schema

The database creates 6 tables automatically on first connection:

- **`users`** — id, name, email, image, points, created_at
- **`scans`** — id, user_id, material, confidence, points_awarded, image_data, confirmed, created_at
- **`proofs`** — id, user_id, scan_id, image_data, status (pending/approved/rejected), created_at
- **`redemptions`** — id, user_id, reward_id, reward_name, cost, created_at
- **`accounts`** — NextAuth OAuth account links
- **`sessions`** — NextAuth session tokens

---

## Design System

- **Colors**: Sage green (`#f5f9f5`) backgrounds, emerald accents, mint cards — earthy, calming palette
- **Dark mode**: `.dark` CSS class with 80+ overridden variables — all surfaces shift to dark greens and greys
- **Glass effects**: Backdrop blur on modals, nav bars, and camera view
- **Animations**: Tree grow (scale burst + sparkles), confetti (80 pieces, CSS keyframes), counter (cubic ease-out), loading shimmer
- **Typography**: Fraunces (serif, headings) + Inter (sans-serif, body)

---

## Rewards Catalog

| Voucher | Points | Value |
|---|---|---|
| ₹20 Amazon Pay | 150 | Entry level |
| ₹50 Flipkart / Zomato | 350 |  |
| ₹100 Amazon / Flipkart / Swiggy | 700–800 | Mid tier |
| ₹200 Amazon Pay | 1,500 |  |
| ₹250 Myntra Fashion | 1,800 |  |
| ₹500 Amazon / Flipkart | 3,500 | High tier |
| ₹1,000 Amazon Pay | 6,500 | Premium |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing`)
5. Open a Pull Request

---

## License

MIT © [Technoversee](https://github.com/technoversee)

---

<p align="center">Built with ♻️ for a cleaner planet</p>
