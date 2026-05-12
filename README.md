# EcosysAI

An AI-powered web application that identifies waste materials from photos, guides users to the correct disposal bin, and rewards proper segregation with redeemable brand vouchers.

Built by **Team Technoverse** for the Smart India Hackathon 2026 — Environment Domain.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Team](#team)

---

## Features

- **AI Waste Recognition** — Take a photo; the system identifies plastic, metal, glass, paper, or food waste along with a confidence score.
- **Live Camera Capture** — Uses the device camera with a live preview. Also supports uploading from the gallery.
- **Disposal Guidance** — Step-by-step instructions for each material type, bin colour coding, and environmental impact facts.
- **Two-Phase Confirmation** — Classification happens first. Points are awarded only after the user confirms they disposed of the item correctly.
- **Points & Rewards** — Each material carries a point value (plastic = 10, metal/glass = 5, paper = 3, food waste = 2). Points can be redeemed for Amazon Pay, Flipkart, Zomato, Swiggy, and Myntra vouchers ranging from ₹20 to ₹1,000.
- **Growing Tree** — A visual tree that progresses through five stages (seed → sprout → sapling → growing → fully grown) as the user earns points.
- **Leaderboard** — Live rankings of all users by total points, with a material breakdown per user.
- **Analytics Dashboard** — Weekly, monthly, and yearly scan trends. Material-wise breakdown, streak tracking, CO₂ savings estimate, and personalised insights.
- **Achievements** — 13 unlockable badges covering scan milestones, point thresholds, and material-specific goals.
- **Dark Mode** — System-aware with a manual toggle. Preference is saved to localStorage. No flash on page load.
- **Nature Background** — Optional rotating nature photography background, toggleable from settings.
- **Google Sign-In** — One-click login via Google OAuth alongside email-only passwordless authentication.
- **Push to Deploy** — Connected to GitHub for automatic deployment via Vercel.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Browser (Client)                                 │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Landing  │  │  Login   │  │Dashboard │  │  Scan    │  │ Leaderboard │  │
│  │  Page    │  │  / Auth  │  │  / Stats │  │  Camera  │  │  Rankings   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Rewards  │  │Analytics │  │ Profile  │  │ Settings │  │  Admin      │  │
│  │ Vouchers │  │  Charts  │  │  / Tree  │  │  Toggles │  │  Reviews    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
│                                                                             │
│  Tailwind CSS v4  │  Lucide React Icons  │  Fraunces + Inter (next/font)   │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │
                    Next.js 16 (App Router)
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌────────────┐ ┌──────────┐ ┌──────────────┐
     │ API Routes │ │ NextAuth │ │ Server-Side  │
     │  (REST)    │ │   v5     │ │  Rendering   │
     └──────┬─────┘ └──────────┘ └──────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌─────────┐   ┌─────────┐
│  Groq   │   │ Turso   │
│  LLM    │   │ libSQL  │
│ (Vision)│   │ (SQLite)│
└─────────┘   └─────────┘
```

**Request flow for a waste scan:**

```
User snaps photo
       │
       ▼
  POST /api/classify  ───→ Groq API (llama-4-scout-17b-16e-instruct)
       │                      │
       │                      ▼
       │               Returns material, confidence,
       │               category, bin, disposal tips
       │
       ▼
  Scan saved to Turso (points_awarded = pending,
  confirmed = 0)
       │
       ▼
  User views result + disposal guidance
       │
       ▼
  User confirms disposal
       │
       ▼
  POST /api/scans/confirm ───→ UPDATE scans SET confirmed=1
                               UPDATE users SET points += N
       │
       ▼
  Celebration animation (confetti, counter, badge check)
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React meta-framework providing file-based routing, server components, and API routes in a single project |
| **React 19** | Component library for building the user interface |
| **TypeScript** | Static type checking across the entire codebase |
| **Tailwind CSS v4** | Utility-first CSS framework for rapid styling with a custom earthy colour palette |
| **Lucide React** | Open-source icon set for consistent UI icons |
| **Fraunces + Inter** | Serif heading and sans-serif body fonts loaded via `next/font/google` with automatic subsetting and swap display |

### Backend

| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful backend endpoints co-located with the frontend under `src/app/api/` |
| **NextAuth.js v5** (Auth.js) | Authentication library handling credential-based (email only, auto-register) and Google OAuth sign-in flows |
| **Groq API** | Cloud inference endpoint for the `meta-llama/llama-4-scout-17b-16e-instruct` vision model used to classify waste from images |

### Database

| Technology | Purpose |
|---|---|
| **Turso (libSQL)** | Serverless SQLite-compatible database used in production. HTTP-based driver works natively in serverless environments |
| **SQLite** | Local file-based database for development, stored at `data/ecosysai.db` |
| **@libsql/client** | Async SQLite driver with identical SQL syntax across both local and remote databases |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| **Vercel** | Hosting and deployment platform. Auto-deploys from the `master` branch on every push |
| **GitHub** | Source control and CI/CD trigger |

---

## How It Works

1. **User signs in** using their email (no password — auto-registers) or Google account.
2. **User opens the scanner** and points their camera at a waste item, or selects a photo from the gallery.
3. **The image is sent to Groq's vision model**, which returns the material type, a confidence score, disposal category, bin colour, and practical tips.
4. **The result is displayed** along with step-by-step disposal instructions and the environmental impact of recycling that material.
5. **User disposes of the item** and taps "Confirm Disposal" to verify.
6. **Points are credited** to the user's account. A celebration animation plays with confetti, an animated counter, and a badge unlock notification if an achievement threshold was crossed.
7. **Points accumulate** toward the tree (which grows through five stages) and toward the leaderboard ranking.
8. **Users redeem points** for brand vouchers (Amazon Pay, Flipkart, Zomato, Swiggy, Myntra) ranging from ₹20 to ₹1,000.

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A Groq API key (free tier available at https://console.groq.com)

### Setup

```bash
git clone https://github.com/technoversee/EcosysAI.git
cd EcosysAI
npm install
```

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=gsk_your_groq_api_key
AUTH_SECRET=your_random_secret_at_least_32_chars
AUTH_URL=http://localhost:3000

# Optional: Google OAuth credentials
# AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
# AUTH_GOOGLE_SECRET=your-google-client-secret

# Optional: Turso credentials for production
# TURSO_DB_URL=libsql://ecosysai-YOUR_ORG.turso.io
# TURSO_DB_AUTH_TOKEN=your-turso-auth-token
```

Generate a secret for `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Start the development server:

```bash
npm run dev
```

The app opens at [http://localhost:3000](http://localhost:3000). The SQLite database is created automatically on the first request.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | — | API key for Groq's vision inference endpoint |
| `AUTH_SECRET` | Yes | — | NextAuth encryption secret (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Yes | — | Application base URL (`http://localhost:3000` in development) |
| `AUTH_GOOGLE_ID` | No | — | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | No | — | Google OAuth client secret |
| `TURSO_DB_URL` | No | — | Turso database URL (required in production for persistent storage) |
| `TURSO_DB_AUTH_TOKEN` | No | — | Turso authentication token |

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/callback/credentials` | No | Email sign-in; creates an account if one doesn't exist |
| `POST` | `/api/auth/callback/google` | No | Google OAuth sign-in |
| `GET` | `/api/auth/session` | No | Returns the current user session (or null) |
| `POST` | `/api/classify` | Yes | Uploads a waste image for AI classification. Does not award points |
| `POST` | `/api/scans/confirm` | Yes | Confirms that the user disposed of the scanned item; awards points |
| `GET` | `/api/scans/trends?range=week\|month\|year` | Yes | Returns scan counts grouped by day, day-of-month, or month for charting |
| `GET` | `/api/leaderboard` | No | Returns the top 50 users by points, plus a material breakdown |
| `POST` | `/api/redeem` | Yes | Deducts points and records a reward redemption |
| `GET` | `/api/proofs` | No | Lists all proof submissions (admin panel) |
| `POST` | `/api/proofs` | Yes | Submits a disposal proof photo |
| `PATCH` | `/api/proofs/[id]` | No | Approves or rejects a proof submission |

---

## Deployment

The project is configured for one-click deployment on Vercel.

### Production Steps

1. Push to the `master` branch of your GitHub repository. Vercel auto-deploys.
2. Add environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.
3. For persistent data across deployments, create a Turso database and add the URL and auth token to Vercel:

   ```bash
   # Install the Turso CLI (macOS / Linux)
   brew install tursodatabase/tap/turso

   # Create a database
   turso db create ecosysai

   # Get the connection URL
   turso db show ecosysai --url

   # Generate an auth token
   turso db create token ecosysai
   ```

4. Add `TURSO_DB_URL` and `TURSO_DB_AUTH_TOKEN` to Vercel. The application uses Turso automatically when these variables are present; otherwise it falls back to a local SQLite file.

> **Note on the database driver:** The project previously used `better-sqlite3`, a native C++ module that cannot compile or run in Vercel's serverless environment. It has been replaced with `@libsql/client`, an HTTP-based driver that works natively in serverless functions.

---

## Project Structure

```
EcosysAI/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — fonts, inline theme script, providers
│   │   ├── page.tsx                # Landing page with particle system, hero, features, team
│   │   ├── globals.css             # Design tokens, dark mode variables, animations, responsive rules
│   │   ├── login/page.tsx          # Authentication page — email sign-in + Google OAuth
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]  # NextAuth catch-all route handler
│   │   │   ├── classify/route.ts   # POST — AI classification of waste image
│   │   │   ├── scans/
│   │   │   │   ├── confirm/route.ts # POST — confirm disposal, award points
│   │   │   │   └── trends/route.ts  # GET — scan data for charts
│   │   │   ├── leaderboard/route.ts # GET — top users + material breakdown
│   │   │   ├── redeem/route.ts      # POST — redeem points for a reward
│   │   │   └── proofs/              # Proof submission and review endpoints
│   │   └── (app)/
│   │       ├── layout.tsx           # Authenticated app shell
│   │       ├── dashboard/page.tsx   # Dashboard — tree, stats, chart, achievements
│   │       ├── scan/page.tsx        # Scanner — camera, result, guidance, celebration
│   │       ├── leaderboard/page.tsx # User rankings
│   │       ├── rewards/page.tsx     # Voucher marketplace
│   │       ├── analytics/page.tsx   # Trend charts, material breakdown, insights
│   │       ├── profile/page.tsx     # User profile with tree and achievements
│   │       ├── settings/page.tsx    # Theme, notification, and background toggles
│   │       └── admin/page.tsx       # Proof review panel
│   ├── components/
│   │   ├── AppLayout.tsx            # Auth guard, sidebar, topbar, bottom nav, notifications
│   │   ├── AppSidebar.tsx           # Desktop sidebar navigation
│   │   ├── AppTopbar.tsx            # Top bar — theme toggle, notification bell, avatar dropdown
│   │   ├── AppBottomNav.tsx         # Mobile bottom navigation bar
│   │   ├── AppNotifications.tsx     # Slide-out notification panel
│   │   ├── TreeAnimation.tsx        # Five-stage tree with grow animation, sway, sparkles
│   │   ├── NatureBackground.tsx     # Rotating Unsplash backgrounds
│   │   ├── NotificationBanner.tsx   # Cycling waste facts banner
│   │   ├── ScanFab.tsx              # Floating action button for scan
│   │   └── Providers.tsx            # Session provider wrapper
│   └── lib/
│       ├── db.ts                    # Database client initialisation (Turso / SQLite) + schema
│       ├── auth.ts                  # NextAuth configuration with credentials + Google providers
│       ├── groq.ts                  # Groq API wrapper for waste image classification
│       └── constants.ts             # Points, tree stages, rewards, achievements, material info
├── public/                          # Static assets
├── .env.example                     # Environment variable template
├── .gitignore
├── AGENTS.md                        # Development agent instructions
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── postcss.config.mjs               # PostCSS / Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

---

## Database Schema

Six tables are created automatically on the first database connection:

- **`users`** — id, name, email, image, points, created_at
- **`scans`** — id, user_id, material, confidence, points_awarded, image_data, confirmed, created_at
- **`proofs`** — id, user_id, scan_id, image_data, status, created_at
- **`redemptions`** — id, user_id, reward_id, reward_name, cost, created_at
- **`accounts`** — OAuth account links (NextAuth)
- **`sessions`** — Session tokens (NextAuth, unused with JWT strategy)

---

## Point Values & Tree Stages

| Material | Points |
|---|---|
| Plastic | 10 |
| Metal | 5 |
| Glass | 5 |
| Paper | 3 |
| Food Waste | 2 |

| Stage | Points Required | Label |
|---|---|---|
| 1 | 0 | Seed |
| 2 | 50 | Sprout |
| 3 | 150 | Sapling |
| 4 | 350 | Growing |
| 5 | 700 | Fully Grown |

---

## Rewards Catalogue

| Voucher | Points |
|---|---|
| ₹20 Amazon Pay | 150 |
| ₹50 Flipkart / Zomato | 350 |
| ₹100 Amazon / Flipkart / Swiggy | 700–800 |
| ₹200 Amazon Pay | 1,500 |
| ₹250 Myntra Fashion | 1,800 |
| ₹500 Amazon / Flipkart | 3,500 |
| ₹1,000 Amazon Pay | 6,500 |

---

## Team

| Member | Role | Contributions |
|---|---|---|
| **Moin Ahmed** | Project Lead & Architect | Team coordination, presentation, documentation |
| **Mohammed Rumaan** | Backend Developer | API development, AI integration, database |
| **Mohammed Asim** | Frontend Developer | UI implementation, responsive design |
| **Mayana Mohammed Farhan Akhtar Khan** | Sustainability Analyst | Report writing, design assistance |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |

---

Built by Team Technoverse — Smart India Hackathon 2026, Environment Domain.
