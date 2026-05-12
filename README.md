# EcosysAI

An AI-driven web application that identifies waste materials from photographs, guides users to the correct disposal bin, and rewards proper segregation with redeemable brand vouchers.

Built by **Team Technoverse** for the Smart India Hackathon 2026 — Environment Domain.

Live at: [https://ecosys-ai.vercel.app](https://ecosys-ai.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Team](#team)

---

## Features

- **AI Waste Recognition** — Snap a photo; the system identifies plastic, metal, glass, paper, or food waste with a confidence score using Groq's vision LLM.
- **Live Camera Capture** — Uses `getUserMedia()` for a live camera preview. Also supports uploading from the device gallery.
- **Disposal Guidance** — Per-material instructions, bin colour coding, and environmental impact facts for each item.
- **Two-Phase Confirmation** — Classification happens first. Points are credited only after the user confirms they disposed of the item correctly.
- **Points & Rewards** — Each material carries a point value. Points can be redeemed for Amazon Pay, Flipkart, Zomato, Swiggy, and Myntra vouchers ranging from ₹20 to ₹1,000.
- **Growing Tree** — A visual tree progresses through five stages (seed → sprout → sapling → growing → fully grown) as the user accumulates points.
- **Leaderboard** — Live rankings of all users by total points, with a material-wise breakdown per user.
- **Analytics Dashboard** — Weekly, monthly, and yearly scan trends. Material breakdown, streak tracking, CO2 savings estimates, and personalised insights.
- **Achievements** — 13 unlockable badges covering scan milestones, point thresholds, and material-specific goals.
- **Dark Mode** — System-aware with a manual toggle. Preference is persisted to localStorage. No flash on page load.
- **Google Sign-In** — One-click authentication via Google OAuth alongside email-only passwordless login.

---

## Architecture

```
                            ┌─────────────────────────────────────┐
                            │           Browser (Client)           │
                            │                                     │
                            │  Next.js 16 App (React 19 + TS)     │
                            │  Tailwind CSS v4  │  Lucide Icons   │
                            │  Fraunces + Inter (Google Fonts)    │
                            └──────────────┬──────────────────────┘
                                           │
                                           │ HTTPS
                                           ▼
                     ┌─────────────────────────────────────────┐
                     │          Vercel (Serverless)             │
                     │                                         │
                     │  ┌───────────────────────────────────┐  │
                     │  │       Next.js API Routes          │  │
                     │  │                                   │  │
                     │  │  POST /api/classify               │  │
                     │  │  POST /api/scans/confirm          │  │
                     │  │  GET  /api/scans/trends           │  │
                     │  │  GET  /api/leaderboard            │  │
                     │  │  POST /api/redeem                 │  │
                     │  │  GET  /api/auth/session           │  │
                     │  └──────────┬────────────┬───────────┘  │
                     │             │            │               │
                     │             ▼            ▼               │
                     │  ┌──────────────┐ ┌──────────────┐     │
                     │  │  NextAuth v5 │ │   Groq API   │     │
                     │  │  (Auth.js)   │ │  (LLM Vision)│     │
                     │  │  Credentials │ │  llama-4-    │     │
                     │  │  + Google    │ │  scout-17b   │     │
                     │  └──────┬───────┘ └──────────────┘     │
                     │         │                               │
                     │         ▼                               │
                     │  ┌──────────────────────────┐           │
                     │  │   @libsql/client (Driver) │           │
                     │  └──────────┬───────────────┘           │
                     └─────────────┼───────────────────────────┘
                                   │
                     ┌─────────────┴──────────────┐
                     │            OR               │
                     ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │  Local Dev       │          │  Production      │
          │  SQLite File     │          │  Turso (libSQL)  │
          │  data/ecosysai.db│          │  Serverless      │
          └──────────────────┘          │  SQLite-over-HTTP│
                                        └──────────────────┘
```

### Scan Flow (End to End)

```
User opens scanner
       │
       ├── "Open Camera" → getUserMedia() → live preview → capture button
       │                                       │
       └── "Choose Photo" → file picker ──────┤
                                              ▼
                                  FormData POST /api/classify
                                              │
                                              ├── auth() → validates JWT session
                                              │
                                              ├── classifyWasteImage(base64)
                                              │     └── Groq API → llama-4-scout-17b
                                              │           → { material, confidence, tips }
                                              │
                                              ├── INSERT INTO scans (confirmed=0)
                                              │     └── @libsql/client → Turso / SQLite
                                              │
                                              ▼
                                  Result displayed + disposal guidance
                                              │
                                  User confirms disposal
                                              │
                                              ▼
                                  POST /api/scans/confirm { scanId }
                                              │
                                              ├── UPDATE scans SET confirmed=1
                                              ├── UPDATE users SET points += N
                                              │
                                              ▼
                                  Celebration: confetti + counter + badge check
```

---

## Tech Stack

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 16** (App Router) | React meta-framework with file-based routing, server components, and co-located API routes |
| UI Library | **React 19** | Component architecture for building the user interface |
| Language | **TypeScript 5** | Static type checking across the entire codebase |
| Styling | **Tailwind CSS v4** | Utility-first CSS framework with a custom earthy colour palette defined in CSS custom properties |
| Icons | **Lucide React** | Open-source icon library for consistent UI icons |
| Typography | **Fraunces** (serif, headings) + **Inter** (sans-serif, body) | Loaded via `next/font/google` with automatic subsetting and `font-display: swap` |

### Backend / API

| Layer | Technology | Purpose |
|---|---|---|
| API Framework | **Next.js API Routes** (REST) | Co-located backend endpoints under `src/app/api/` handling all server-side logic |
| Authentication | **NextAuth.js v5** (Auth.js) | Dual-provider auth: email-only credentials (auto-register) + Google OAuth. JWT session strategy |
| AI Inference | **Groq API** | Cloud LLM endpoint running `meta-llama/llama-4-scout-17b-16e-instruct` for vision-based waste classification |
| AI SDK | **OpenAI SDK** (`openai` npm package) | HTTP client used to communicate with Groq's OpenAI-compatible API |

### Database

| Layer | Technology | Purpose |
|---|---|---|
| Driver | **@libsql/client** | Async SQLite driver that supports both local files and remote serverless databases via HTTP |
| Local (Dev) | **SQLite** (file-based) | `data/ecosysai.db` — created automatically on first request. Zero setup |
| Production (Vercel) | **Turso (libSQL)** | Serverless SQLite database accessed over HTTP. Shared across all serverless function instances for data persistence |
| Schema | **SQL DDL** | 8 tables created automatically on first connection via `CREATE TABLE IF NOT EXISTS` |

**Why this database setup?** The project initially used `better-sqlite3`, a native C++ addon that cannot compile or run in Vercel's serverless environment. We replaced it with `@libsql/client`, which provides an identical SQL interface but works natively on serverless runtimes. In development it connects to a local SQLite file; in production it connects to Turso.

### Infrastructure & DevOps

| Layer | Technology | Purpose |
|---|---|---|
| Hosting | **Vercel** | Serverless deployment platform. Auto-deploys from the `master` branch |
| Source Control | **GitHub** | Code repository and CI/CD trigger |

---

## How It Works

1. **Sign in** using email (no password required — auto-registers) or Google account.
2. **Open the scanner** and either point the camera at a waste item or select a photo from the gallery.
3. **The image is sent to Groq's vision model**, which returns the material type, confidence score, disposal category, appropriate bin, and practical tips.
4. **The result is displayed** alongside material-specific disposal instructions and the environmental impact of recycling that item.
5. **Confirm disposal** once you have placed the item in the correct bin.
6. **Points are credited** to your account. A celebration plays with confetti, an animated counter, and a badge unlock notification if an achievement threshold was crossed.
7. **Points accumulate** toward your tree (five growth stages) and your position on the leaderboard.
8. **Redeem points** for brand vouchers from Amazon Pay, Flipkart, Zomato, Swiggy, and Myntra.

### Point Values

| Material | Points |
|---|---|
| Plastic | 10 |
| Metal | 5 |
| Glass | 5 |
| Paper | 3 |
| Food Waste | 2 |

### Tree Stages

| Stage | Points Required | Visual |
|---|---|---|
| Seed | 0 | 🌰 |
| Sprout | 50 | 🌱 |
| Sapling | 150 | 🌿 |
| Growing | 350 | 🌳 |
| Fully Grown | 700 | 🌲 |

### Rewards Catalogue

| Voucher | Points Needed |
|---|---|
| ₹20 Amazon Pay | 150 |
| ₹50 Flipkart / Zomato | 350 |
| ₹100 Amazon Pay / Flipkart / Swiggy | 700–800 |
| ₹200 Amazon Pay | 1,500 |
| ₹250 Myntra Fashion | 1,800 |
| ₹500 Amazon Pay / Flipkart | 3,500 |
| ₹1,000 Amazon Pay | 6,500 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Local Setup

```bash
git clone https://github.com/technoversee/EcosysAI.git
cd EcosysAI
npm install
```

Create `.env.local` at the project root:

```env
GROQ_API_KEY=gsk_your_groq_api_key
AUTH_SECRET=your_random_secret_min_32_chars
AUTH_URL=http://localhost:3000

# Optional: Google OAuth credentials
# AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
# AUTH_GOOGLE_SECRET=your-google-client-secret

# Optional: Turso credentials (only needed for production deployment)
# TURSO_DB_URL=libsql://ecosysai-YOUR_ORG.turso.io
# TURSO_DB_AUTH_TOKEN=your-turso-auth-token
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database creates itself automatically on the first API request.

---

## Environment Variables

| Variable | Required | Local Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | — | API key for Groq's vision inference endpoint |
| `AUTH_SECRET` | Yes | — | NextAuth encryption secret for JWT signing |
| `AUTH_URL` | Yes | `http://localhost:3000` | Application base URL (must match deployment URL in production) |
| `AUTH_GOOGLE_ID` | For Google OAuth | — | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | For Google OAuth | — | Google OAuth client secret |
| `TURSO_DB_URL` | Production only | — | Turso database URL (`libsql://...turso.io`). App uses local SQLite when this is absent |
| `TURSO_DB_AUTH_TOKEN` | Production only | — | Turso database auth token |

---

## API Reference

All endpoints prefixed with `/api/`. Auth-protected routes require a valid NextAuth session cookie.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/callback/credentials` | No | Email sign-in; creates account if new |
| `POST` | `/api/auth/callback/google` | No | Google OAuth sign-in |
| `GET` | `/api/auth/session` | No | Returns current session or null |
| `POST` | `/api/classify` | Yes | Upload waste image → AI classification (no points awarded yet) |
| `POST` | `/api/scans/confirm` | Yes | Confirm disposal → points credited |
| `GET` | `/api/scans/trends?range=week\|month\|year` | Yes | Scan counts for charting, grouped by time period |
| `GET` | `/api/leaderboard` | No | Top 50 users by points + material breakdown |
| `POST` | `/api/redeem` | Yes | Deduct points and record a reward redemption |
| `GET` | `/api/proofs` | No | List proof submissions (admin) |
| `POST` | `/api/proofs` | Yes | Submit a disposal proof photo |
| `PATCH` | `/api/proofs/[id]` | No | Approve / reject a proof (admin) |

---

## Database Schema

The database driver (`@libsql/client`) creates the following tables automatically on first connection. The same DDL runs against both local SQLite and Turso.

- **`users`** — `id TEXT PK`, `name TEXT`, `email TEXT UNIQUE`, `image TEXT`, `points INTEGER DEFAULT 0`, `created_at TEXT`
- **`scans`** — `id TEXT PK`, `user_id TEXT FK→users`, `material TEXT`, `confidence REAL`, `points_awarded INTEGER`, `image_data TEXT`, `confirmed INTEGER DEFAULT 0`, `created_at TEXT`
- **`proofs`** — `id TEXT PK`, `user_id TEXT FK→users`, `scan_id TEXT FK→scans`, `image_data TEXT`, `status TEXT CHECK(pending,approved,rejected)`, `created_at TEXT`
- **`redemptions`** — `id TEXT PK`, `user_id TEXT FK→users`, `reward_id INTEGER`, `reward_name TEXT`, `cost INTEGER`, `created_at TEXT`
- **`accounts`** — OAuth account links (NextAuth, unused with JWT strategy)
- **`sessions`** — Session tokens (NextAuth, unused with JWT strategy)
- **`verification_tokens`** — Email verification tokens (reserved for future use)
- **`waste_facts`** — `id INTEGER PK AUTOINCREMENT`, `fact TEXT NOT NULL`

---

## Deployment

The project is configured for one-click deployment on Vercel. Every push to the `master` branch triggers an automatic build and deploy.

### Vercel Steps

1. Push to `master` — Vercel auto-deploys from the GitHub integration.
2. Add all environment variables from the table above in **Vercel → Project → Settings → Environment Variables**.
3. For persistent data across deployments, set up a Turso database:

```bash
# Install Turso CLI (macOS / Linux)
brew install tursodatabase/tap/turso

# Create a database
turso db create ecosysai

# Get the URL
turso db show ecosysai --url

# Generate an auth token
turso db create token ecosysai
```

Add `TURSO_DB_URL` and `TURSO_DB_AUTH_TOKEN` to Vercel. The app uses Turso automatically when these variables are present; otherwise it falls back to `/tmp/ecosysai.db` (ephemeral) or a local file for development.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, theme init script, providers
│   ├── page.tsx                # Landing page (1094 lines — particles, hero, features, team)
│   ├── globals.css             # 1284 lines — design tokens, dark mode, all component styles
│   ├── login/page.tsx          # Auth page: email sign-in + Google OAuth button
│   ├── api/
│   │   ├── auth/[...nextauth]  # NextAuth route handler
│   │   ├── classify/route.ts   # POST — AI waste classification
│   │   ├── scans/confirm/route.ts # POST — confirm disposal, award points
│   │   ├── scans/trends/route.ts  # GET — scan data for charts
│   │   ├── leaderboard/route.ts   # GET — rankings + material breakdown
│   │   ├── redeem/route.ts        # POST — reward redemption
│   │   └── proofs/             # Photo proof submission + admin review
│   └── (app)/                  # Authenticated route group
│       ├── layout.tsx          # App shell wrapper
│       ├── dashboard/page.tsx  # Tree, stats, chart, achievements
│       ├── scan/page.tsx       # Camera, classification, guidance, celebration
│       ├── leaderboard/page.tsx # User rankings table
│       ├── rewards/page.tsx    # Voucher marketplace
│       ├── analytics/page.tsx  # Trend charts, material breakdown, CO2 tracker
│       ├── profile/page.tsx    # User profile with tree + badges
│       ├── settings/page.tsx   # Dark mode, notifications, background toggles
│       └── admin/page.tsx      # Proof review panel
├── components/
│   ├── AppLayout.tsx           # Auth guard + shell (sidebar, topbar, nav, notifications)
│   ├── AppSidebar.tsx          # Desktop sidebar navigation
│   ├── AppTopbar.tsx           # Top bar: theme toggle, bell icon, avatar dropdown
│   ├── AppBottomNav.tsx        # Mobile bottom navigation
│   ├── AppNotifications.tsx    # Slide-out notifications panel
│   ├── TreeAnimation.tsx       # 5-stage SVG tree with grow animation + sparkles
│   ├── NatureBackground.tsx    # Rotating Unsplash nature backgrounds
│   ├── NotificationBanner.tsx  # Cycling waste facts
│   ├── ScanFab.tsx             # Floating scan button (mobile)
│   └── Providers.tsx           # NextAuth SessionProvider wrapper
└── lib/
    ├── db.ts                   # Database client: @libsql/client with Turso/SQLite fallback
    ├── auth.ts                 # NextAuth config: credentials + Google providers
    ├── groq.ts                 # Groq API wrapper for image classification
    └── constants.ts            # Points, tree stages, 12 rewards, 13 achievements, material info
```

---

## Scripts

| Command | What It Does |
|---|---|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create an optimised production build (TypeScript + Next.js) |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |

---

## Team

| Member | Role | Responsibilities |
|---|---|---|
| **Moin Ahmed** | Project Lead & Architect | Team coordination, presentation development, project documentation |
| **Mohammed Rumaan** | Backend Developer / Systems Architect | API development, AI integration, database architecture |
| **Mohammed Asim** | Frontend Developer / Interface Engineer | UI implementation, responsive design, component architecture |
| **Mayana Mohammed Farhan Akhtar Khan** | Sustainability Analyst | Report generation, design assistance, content research |

---

Built by Team Technoverse · Smart India Hackathon 2026 · Environment Domain

[ecosys-ai.vercel.app](https://ecosys-ai.vercel.app) · [github.com/technoversee/EcosysAI](https://github.com/technoversee/EcosysAI)
