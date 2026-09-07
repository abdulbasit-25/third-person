# Copilot Prompt — "Mirror" (BSAI'24 SZABIST Perception Platform), Full Stack from Zero

Paste this into Copilot Chat (or Copilot workspace) as the first prompt for a brand-new repository.

---

## PROJECT SUMMARY

Build **Mirror**, a private personal feedback and perception platform for **Abdul Basit — BS Artificial Intelligence, Batch of 2024, SZABIST**. Classmates and teachers create accounts, submit detailed reviews about Basit (ratings, personality traits, memories, honest advice, private notes), and can update their review later — every past version is preserved. Basit is the sole admin and sees everything: analytics, individual reviewer history, version comparisons, exports.

Build this as **one single deployable project** — a single repo, single folder structure, deployed as **serverless functions on Vercel**, with **MongoDB Atlas** as the database. No separate backend server, no separate frontend repo. One `vercel deploy` should ship the whole thing.

---

## TECH STACK (fixed — do not substitute)

- **Framework:** Next.js 14+ (App Router), TypeScript throughout.
- **Hosting:** Vercel, serverless (Next.js API routes / Route Handlers under `app/api/**`, each deployed as its own serverless function automatically — no custom server, no `server.js`, no long-running processes).
- **Database:** MongoDB Atlas via the official `mongodb` driver (native driver, not Mongoose — keeps cold starts fast on serverless; use a cached client pattern so we don't exhaust Atlas connections on every function invocation).
- **Auth:** Custom JWT-based auth (`jsonwebtoken`), passwords hashed with `bcryptjs`. JWT stored in an **httpOnly, secure cookie**, not localStorage. Two roles: `admin` (Basit only, single hardcoded/seeded admin account) and `reviewer` (`student` or `teacher`).
- **Styling:** Tailwind CSS, configured with the custom design tokens described in the design section below (custom fonts, custom color scale, no default shadcn look-and-feel out of the box — we will restyle primitives).
- **Validation:** `zod` for all API input validation and for parsing environment variables at boot.
- **State/data fetching:** React Server Components for read-heavy admin pages, `fetch` + Server Actions or minimal client fetch for interactive form flows (review wizard, live rating summary) — use Server Actions where they simplify things, client components only where genuine interactivity is needed (multi-step form, rating sliders, trait picker, toasts).

---

## REPO / FOLDER STRUCTURE

Single Next.js project at the repo root. Target structure:

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                     # Landing page
│   │   ├── register/page.tsx            # Reviewer registration
│   │   ├── login/page.tsx               # Reviewer login
│   │   └── admin-login/page.tsx         # Admin login (separate, unlisted route)
│   ├── (reviewer)/
│   │   ├── review/
│   │   │   ├── intro/page.tsx
│   │   │   ├── new/page.tsx             # Multi-step review wizard
│   │   │   ├── summary/page.tsx
│   │   │   └── history/page.tsx
│   │   └── dashboard/page.tsx           # Reviewer's own dashboard
│   ├── (admin)/
│   │   ├── dashboard/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── reviews/[reviewerId]/page.tsx
│   │   ├── reviews/[reviewerId]/compare/page.tsx
│   │   ├── people/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── traits/page.tsx
│   │   ├── export/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── admin-login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── reviews/
│       │   ├── route.ts                 # POST create/new version, GET list (admin)
│       │   ├── mine/route.ts            # GET current reviewer's own review + history
│       │   └── [id]/route.ts            # GET single review version
│       ├── analytics/
│       │   ├── summary/route.ts
│       │   ├── traits/route.ts
│       │   ├── timeline/route.ts
│       │   └── compare/route.ts
│       └── export/route.ts              # streams CSV / JSON
├── lib/
│   ├── mongodb.ts                       # cached client/connection helper
│   ├── auth.ts                          # JWT sign/verify, cookie helpers, session helpers
│   ├── schemas.ts                       # zod schemas for all API payloads
│   ├── constants.ts                     # rating categories, trait list, question list
│   └── analytics.ts                     # aggregation pipeline builders
├── components/
│   ├── ui/                              # restyled primitives: Button, Card, Input, Chip, Stat, Toast, ProgressSteps
│   ├── review-form/                     # one component per wizard section (A–G)
│   ├── admin/                           # dashboard cards, charts, review feed, timeline, comparison view
│   └── landing/
├── middleware.ts                        # route protection for (admin) and (reviewer) groups based on JWT cookie
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

Keep everything inside this one tree. Do not create a `/server` or `/backend` sibling folder — API routes under `app/api` are the entire backend and Vercel deploys them as serverless functions automatically.

---

## ENVIRONMENT VARIABLES

Create `.env.example` with:

```dotenv
MONGODB_URI=
JWT_SECRET=
```

- `MONGODB_URI` — full Atlas connection string, read once and reused via a cached/global client in `lib/mongodb.ts` (guard against creating a new client on every hot-reload in dev and every cold start in prod — use the standard Next.js "cache the client on `globalThis` in development" pattern, and a module-scope singleton in production).
- `JWT_SECRET` — used to sign/verify both admin and reviewer JWTs. Fail fast (throw a clear startup error) if either env var is missing, validated via a small zod schema in `lib/env.ts`.

Document in the README that on Vercel these two variables must be added in Project Settings → Environment Variables, and in Atlas the cluster's network access must allow `0.0.0.0/0` (or Vercel's IP ranges) since serverless functions have dynamic IPs.

---

## DATA MODEL (MongoDB collections)

**`users`**
```ts
{
  _id: ObjectId,
  username: string,        // unique, lowercase
  displayName: string,
  passwordHash: string,
  role: "admin" | "reviewer",
  status: "student" | "teacher" | null,  // null for admin
  createdAt: Date
}
```

**`reviews`** — one document **per version**, never overwritten/deleted on update. This is what makes the version history feature work.
```ts
{
  _id: ObjectId,
  reviewerId: ObjectId,        // ref users._id
  version: number,              // 1, 2, 3...
  isCurrent: boolean,           // true only on the latest version for that reviewer
  createdAt: Date,

  relationship: string[],       // classmate, friend, teammate, senior, junior, teacher, other
  knownDuration: string,
  interactionFrequency: string,

  ratings: {
    overall: number, problemSolving: number, technicalSkills: number,
    teamwork: number, communication: number, personality: number,
    friendliness: number, ambition: number, reliability: number,
    academicAbility: number, leadership: number
  },

  traits: string[],             // selected + custom traits

  answers: {
    bestThing: string, improve: string, reallyGoodAt: string,
    dontRealize: string, threeWords: [string, string, string],
    workingWithMe: string, honestAdvice: string,
    bestMemory: string, funniestMoment: string, firstMemory: string,
    opinionChanged: string, opinionChangedWhy: string,
    rememberInYears: string, rememberMostAfterUni: string,
    surprisedMoment: string, neverChange: string, fiveYearAdvice: string
  },

  quickChoices: { movieCharacter: string, workStyle: string, socialStyle: string },

  privateFeedback: string,      // visible to admin only, never surfaced in public-style feeds

  finalRating: number,
  workAgain: string,
  finalSentence: string
}
```

**`invites`** *(optional, for the response-rate feature)*
```ts
{ _id: ObjectId, name: string, invitedAt: Date, respondedUserId: ObjectId | null }
```

Indexes to create on startup/migration script:
- `users.username` unique
- `reviews.reviewerId + isCurrent`
- `reviews.reviewerId + version`

---

## AUTH FLOW

- **Reviewer register:** `POST /api/auth/register` — validate with zod, hash password with bcrypt (cost 12), enforce unique username, create user with role `reviewer`, sign JWT `{ sub, role, status }`, set httpOnly cookie, return the created profile (no password hash).
- **Reviewer login:** `POST /api/auth/login` — verify password, sign JWT, set cookie.
- **Admin login:** single seeded admin account (seed script creates it from an interactive prompt or a one-time `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD` you pass only at seed time, not committed) — `POST /api/auth/admin-login` checks role === "admin".
- **Session:** `GET /api/auth/me` reads the cookie, verifies JWT, returns `{ id, role, status, displayName }`.
- **Logout:** clears the cookie.
- **`middleware.ts`:** protects `(admin)/*` routes (require role `admin`) and `(reviewer)/*` routes (require role `reviewer`), redirecting to the appropriate login page otherwise. Admin routes must 404 or redirect for reviewer-role tokens — never leak that the admin area exists via a generic "unauthorized" page that hints at its structure.

---

## KEY API BEHAVIOR

- **Creating/updating a review** (`POST /api/reviews`): look up the reviewer's current version (`isCurrent: true`). If none exists, insert version 1 with `isCurrent: true`. If one exists, insert a new document with `version: currentVersion + 1, isCurrent: true` **and** flip the previous document's `isCurrent` to `false` in the same operation (use a MongoDB transaction/session since this is two writes that must stay consistent — Atlas supports transactions on replica sets, which the default Atlas cluster is).
- **Reviewer's own view** (`GET /api/reviews/mine`): current version + list of past versions (id, version, date, overall rating only, for the timeline view).
- **Admin review list** (`GET /api/reviews`): only returns `isCurrent: true` documents by default, joined with reviewer `displayName`/`status`, supports query params for filter (`status`, `sort`, `hasPrivateFeedback`, `hasMultipleVersions`) and `search` (regex on displayName, case-insensitive, escaped).
- **Version comparison** (`GET /api/analytics/compare?reviewerId=&v1=&v2=`): returns both full documents plus a computed delta object per rating category.
- **Analytics summary** (`GET /api/analytics/summary`): a single aggregation pipeline over `reviews` (`isCurrent: true`) computing: average per rating category overall and split by `status`, trait frequency counts, most-mentioned/least-consistent (highest variance) category, review count / student count / teacher count. Build this with MongoDB's `$group`/`$facet` so it's one round trip, not N queries in a loop — put the pipeline construction in `lib/analytics.ts` so it's testable and reusable.
- **Timeline** (`GET /api/analytics/timeline`): buckets reviews by month (`$dateToString` on `createdAt`) with running review count and category averages, used for the "perception over time" charts.
- **Export** (`GET /api/export?format=csv|json&filter=...`): streams a response; for CSV, flatten the review documents (ratings, traits joined by `;`, answers) with a small hand-rolled CSV writer (no need for a heavy dependency) and set `Content-Disposition: attachment`.

All API routes: validate input with zod, return consistent `{ error: string }` shape on failure with proper status codes (400/401/403/404/500), never leak stack traces or Mongo error internals to the client.

---

## FRONTEND — CARRY OVER THE "MIRROR" DESIGN SYSTEM

Reuse the full screen list and content structure from the earlier frontend-only spec (landing page, registration/login, review intro, the full A–G multi-step review wizard including all rating categories, trait list, and the full expanded question set — best memory, funniest moment, first memory, opinion-changed, remember-in-years, surprised-moment, never-change, five-year-advice — quick choices, private feedback section, submission summary, reviewer dashboard + history, and the full admin dashboard with key insights, rating breakdown, student-vs-teacher comparison, "the class describes you as," memory quote cards, "you may not realize" section, strengths/growth areas, review feed with filters, individual reviewer profile, version comparison, global timeline, analytics page, response activity, export page, settings, empty states, and toasts).

Apply the **Mirror aesthetic**, now wired to real data instead of mock data:

- Editorial serif/display headline font paired with a technical monospace/grotesk for stats, labels, dates, version numbers.
- Deep charcoal-navy "paper" dark mode as default, warm off-white light mode as the inverse — no default Tailwind slate/indigo look.
- One restrained accent color; ratings use a muted single-hue scale, not red/yellow/green traffic-light colors.
- Asymmetric layout, oversized numerals for key stats next to small caps monospace labels, hairline borders instead of drop shadows, subtle low-opacity linework/grid texture in backgrounds.
- Small recurring signature mark: `ABDUL BASIT — BSAI'24, SZABIST` in the landing hero and as a footer/header tag across admin pages, styled as a signature, not a logo lockup.
- Voice: warm, specific, a little witty — never corporate HR copy. ("Send it to Basit," not "Submit Form.")
- Reviewer wizard progress shown as a stepped index (`01/06` style) rather than a generic progress bar; large touch targets, one section per screen on mobile, sticky next/back, character counts on long-answer fields.
- Version history and comparison views should visually read like comparing two dated entries in a journal — dates and version numbers in monospace, deltas shown with a small `+0.9` / `−0.3` treatment next to each category.

Restyle every shadcn/Tailwind primitive you use (`Button`, `Card`, `Input`, `Badge`→trait chip, `Progress`) to match this system rather than using their out-of-the-box look.

---

## SEEDING & DEV SETUP

- `scripts/seed.ts` — run via `npm run seed` — creates the single admin user (Abdul Basit) from `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` env vars supplied only at seed time (document this in README, don't commit real credentials), plus optionally seeds a realistic batch of demo reviewer accounts and multi-version review documents for local development/testing so the dashboard isn't empty on first run.
- `npm run dev` — Next.js dev server, connecting to the same Atlas cluster (or a separate dev database — recommend using a distinct database name like `mirror_dev` vs `mirror_prod` inside the same Atlas cluster, configurable via the URI's path segment).

---

## DEPLOYMENT (Vercel)

- Single Vercel project pointing at this repo root — no monorepo config needed.
- Framework preset: Next.js (auto-detected).
- Environment variables `MONGODB_URI` and `JWT_SECRET` set in Vercel Project Settings for Production, Preview, and Development environments (can point Preview at the `mirror_dev` database).
- Confirm Atlas Network Access allows connections from anywhere (`0.0.0.0/0`) since Vercel serverless functions don't have static outbound IPs on the default plan.
- Add a `vercel.json` only if needed for route-specific config (e.g., increasing the max duration on the export route if large exports risk timing out) — otherwise rely on Next.js defaults.
- README should include exact steps: clone → `npm install` → copy `.env.example` to `.env.local` and fill in Atlas URI + JWT secret → `npm run seed` → `npm run dev`; then for prod: push to GitHub → import into Vercel → set env vars → deploy.

---

## BUILD ORDER (do this incrementally, not all at once)

1. Scaffold Next.js + TypeScript + Tailwind, set up `lib/mongodb.ts`, `lib/env.ts`, `.env.example`.
2. Auth: `users` model, register/login/admin-login/me/logout routes, JWT + cookie helpers, `middleware.ts` route protection.
3. Seed script with the admin account.
4. Review wizard (frontend) + `POST /api/reviews` with the versioning transaction logic.
5. Reviewer dashboard + history views wired to `GET /api/reviews/mine`.
6. Admin review feed + filters/search wired to `GET /api/reviews`.
7. Individual reviewer profile + version comparison view + `/api/analytics/compare`.
8. Admin dashboard analytics wired to `/api/analytics/summary` and `/api/analytics/traits`.
9. Timeline page wired to `/api/analytics/timeline`.
10. Export route + export page.
11. Settings page (admin profile fields, review toggles — persisted in a small `settings` collection with a single document).
12. Apply/finish the full Mirror design system pass across every screen, empty states, toasts, responsive pass, dark mode pass.

Build and verify each numbered step before moving to the next rather than generating all files at once — confirm the API routes work against a real Atlas connection before layering the full design system on top.
