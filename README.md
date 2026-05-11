# EcosysAI ♻️

**Scan waste → know your bin → earn points → grow a tree.**

A web app built for a hackathon — helps people figure out if something is recyclable, which bin to toss it in, and rewards them for doing it right.

---

## What it does

- **AI waste recognition** — take a photo of your trash, the app tells you what it's made of (plastic, metal, paper, glass, or food waste) with a confidence score
- **Point system** — earn points based on material (plastic = 10, metal/glass = 5, paper = 3, food = 2)
- **Google sign-in** — simple login to save your scans and points
- **Leaderboard** — see who's recycling the most, updated live
- **Growing tree** — your tree grows from a seed to a fully grown tree as your points go up (0 / 50 / 150 / 350 / 700)
- **Motivational facts** — cycling waste facts so you learn while you sort
- **Consistency check** — upload a photo of your segregated waste, a judge approves it for 5 bonus points
- **Mock rewards** — redeem points for things like a coffee discount or an eco tote bag (fake QR code — no real payments)

---

## Built with

| What | Why |
|------|-----|
| **Next.js 16** | Full-stack React framework — frontend + API routes in one project |
| **TypeScript** | Because `any` is a code smell |
| **Tailwind CSS v4** | Fast styling with a custom earthy color palette built into the theme |
| **SQLite** | Zero-setup database, single file, perfect for a hackathon |
| **NextAuth.js** | Google OAuth login in a few lines of config |
| **Groq (llama-3.2-90b-vision)** | Free vision AI to classify waste from photos |
| **Lucide React** | Clean open-source icons |
| **Fraunces + Inter** | Serif headings + sans-serif body — looks good, loads fast |
| **Framer Motion** | Smooth tree transitions and micro-animations |
| **Vercel** | One-click deploy from GitHub |

---

## Getting started

```bash
git clone https://github.com/technoversee/EcosysAI.git
cd EcosysAI
npm install
```

Create a `.env.local` file:

```env
GROQ_API_KEY=your_key_here
AUTH_SECRET=your_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── api/          # Backend API routes
│   ├── scan/         # Camera / upload page
│   ├── leaderboard/  # Rankings
│   ├── rewards/      # Mock shop
│   ├── profile/      # User profile + tree
│   └── admin/        # Judge approval panel
├── components/       # Reusable UI bits
├── lib/              # DB, AI, auth, constants
└── styles/           # Tailwind globals
```

---

## Scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Check for lint issues |
| `start.bat` | Launch the app (Windows) |
| `stop.bat` | Kill the server (Windows) |

---

Made in a hurry for a hackathon. Probably has bugs. Use at your own risk 🌱
