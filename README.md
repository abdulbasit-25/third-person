# Mirror

Mirror is a private perception archive for Abdul Basit. It gives people who
know him a thoughtful place to record how they experience him, what moments
stand out, and what advice they would offer. Reviewers can return later and
submit an updated perspective; every version is preserved for the archive.

Basit is the administrator and can review the collected perspectives through a
protected dashboard, inspect reviewer history, view ratings and analytics,
respond to reviews, explore the timeline, and export the archive.

The project exists to make personal feedback more specific, honest, and useful
over time. It is intentionally private and focused: this is a reflection tool,
not a public social network or a generic survey platform.

## What It Includes

- Editorial landing page explaining the purpose of Mirror.
- Reviewer registration and login with role-based access.
- Six-step review composer covering context, ratings, traits, memories,
  honest advice, and overall feeling.
- Review versioning: new submissions preserve earlier versions and mark only
  the latest version as current.
- Administrator login and protected archive dashboard.
- Review archive with full notes, category ratings, colored score states, and
  earlier versions.
- Reviewer history and people views.
- Analytics, timeline, review responses, and JSON export surfaces.
- MongoDB indexes for unique usernames, current reviews, and review versions.
- Responsive visual system built around an editorial, paper-and-ink aesthetic.

## Product Flow

### Reviewer

1. Create an account as a student or teacher.
2. Read the introduction and start a review.
3. Complete the six-step review flow.
4. Submit the perspective to create version one.
5. Return later to update the review; the previous version remains in history.

### Administrator

1. Sign in through the separate administrator login.
2. Open the protected dashboard.
3. Read current and earlier reviewer perspectives.
4. Compare ratings, traits, and written feedback across the archive.
5. Reply to reviews, inspect analytics and timeline views, or export data.

## Technology

- Next.js 16 App Router and React 19.
- TypeScript throughout the application.
- MongoDB using the official `mongodb` driver.
- JWT sessions stored in HTTP-only cookies.
- `bcryptjs` for password hashing.
- `zod` for environment and request validation.
- Tailwind CSS 4 through the Next.js/PostCSS setup.
- Vitest for automated schema, authentication, and rate-limit tests.
- Lucide React for interface icons.

The application is a single deployable Next.js project. Pages and API route
handlers live together under `app/`; there is no separate frontend or backend
service.

## Theme and Design

Mirror uses a quiet editorial theme designed to make personal writing feel
considered rather than transactional. The interface is light, tactile, and
slightly archival: paper surfaces, thin rules, serif display typography, and
monospace metadata create the feeling of a carefully kept notebook.

### Visual language

- **Theme:** light paper-and-ink editorial archive.
- **Display type:** Georgia/Times-style serif for large headings and reflective
  review text.
- **Interface type:** Courier-style monospace for labels, navigation, metadata,
  and compact controls.
- **Structure:** generous whitespace, thin dividers, editorial grids, and
  restrained motion.
- **Tone:** private, precise, warm, and reflective instead of corporate or
  dashboard-heavy.

### Color palette

| Token            | Value     | Role                                                  |
| ---------------- | --------- | ----------------------------------------------------- |
| `--ink`          | `#182329` | Primary text and dark action surfaces                 |
| `--ink-soft`     | `#3a4650` | Secondary text and softened dark controls             |
| `--paper`        | `#f3efe7` | Main page background and light surfaces               |
| `--paper-deep`   | `#e7e0d4` | Footer, panels, and deeper paper surfaces             |
| `--muted`        | `#69736f` | Supporting text and metadata                          |
| `--accent`       | `#b45d3c` | Burnt-clay accent, links, highlights, and focus rings |
| `--accent-hover` | `#9c4c2f` | Darker accent hover state                             |
| `--accent-soft`  | `#e1b29d` | Soft accent surfaces and secondary highlights         |

The review choice controls use a separate stamped-badge palette so they are
visually distinct from navigation and action controls. Idle choices use cream
(`#f6f1e7`), warm gray borders (`#cdc4b2`), and muted brown-gray text
(`#6b6252`). Selected choices use burnt orange (`#c1611f`) with a darker
orange border (`#b5541c`) and off-white text (`#fff8ef`).

Navigation and action buttons use the ink or accent colors with lift, shadow,
underline, and focus-ring interactions. They do not use the choice controls'
square indicators, so users can distinguish "choose an option" from "go or
submit" at a glance.

The design tokens live in `app/globals.css`. Shared interaction components and
layout patterns live in `components/`, including the choice-button treatment
in `components/ui/ChoiceButton.tsx`.

## Requirements

- Node.js 20 or newer.
- npm.
- A MongoDB database, local or hosted. MongoDB Atlas is recommended for a
  deployment.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/mirror
   JWT_SECRET=replace-with-at-least-32-random-characters
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   `NEXT_PUBLIC_SITE_URL` should be the deployed origin in production:
   `https://archiveme.vercel.app`. It is used for canonical URLs, Open Graph
   links, `robots.txt`, and the sitemap. `.env.example` contains the required
   application variables. Keep `.env.local` out of version control.

3. Seed the administrator and database indexes. The seed command requires
   administrator credentials at runtime; they are deliberately not stored in
   source code:

   PowerShell:

   ```powershell
   $env:ADMIN_SEED_USERNAME="admin"
   $env:ADMIN_SEED_PASSWORD="use-a-strong-password"
   npm run seed
   ```

   macOS/Linux:

   ```bash
   ADMIN_SEED_USERNAME=admin \
   ADMIN_SEED_PASSWORD=use-a-strong-password \
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev       # Start the Next.js development server
npm run lint      # Run ESLint
npm test          # Run the Vitest test suite
npx tsc --noEmit  # Run the TypeScript checker
npm run build     # Create a production build
npm run seed      # Create indexes and seed/update the administrator
npm start         # Serve the production build
```

Run the lint, test, typecheck, and build commands before deployment.

## Routes

### Public and reviewer routes

| Route           | Purpose                               |
| --------------- | ------------------------------------- |
| `/`             | Public introduction to Mirror         |
| `/register`     | Create a reviewer account             |
| `/login`        | Reviewer login                        |
| `/review/intro` | Reviewer introduction and entry point |
| `/review/new`   | Create or update a review             |

### Administrator routes

| Route                    | Purpose                            |
| ------------------------ | ---------------------------------- |
| `/admin-login`           | Administrator login                |
| `/dashboard`             | Dashboard overview                 |
| `/dashboard/reviews`     | Review archive and version history |
| `/dashboard/people`      | Reviewer directory                 |
| `/dashboard/people/[id]` | Individual reviewer history        |
| `/dashboard/analytics`   | Rating and archive analytics       |
| `/dashboard/timeline`    | Review timeline                    |
| `/dashboard/export`      | JSON export surface                |

### API areas

- `/api/auth/*` handles registration, reviewer login, administrator login,
  logout, and session inspection.
- `/api/reviews` handles review creation, versioning, and administrator reads.
- `/api/reviews/mine` serves the authenticated reviewer's own history.
- `/api/reviews/[id]` handles individual review operations and administrator
  responses.
- `/api/analytics/summary` provides analytics summary data.

Middleware protects `/review/*` for reviewers and `/dashboard/*` for admins.
Sensitive API routes also perform role checks in their handlers.

## Project Structure

```text
app/
  api/                 Route handlers for auth, reviews, and analytics
  dashboard/           Protected administrator pages
  review/              Reviewer introduction and review composer
  admin-login/         Administrator login page
  login/               Reviewer login page
  register/            Reviewer registration page
  page.tsx             Public landing page
components/
  layout/              Shared header and footer
  ui/                  Reusable interface components
  auth-form.tsx        Login and registration form
  reviewer-history.tsx Review archive interaction
lib/
  auth.ts              JWT sessions and cookie helpers
  constants.ts         Rating categories and predefined traits
  env.ts               Environment validation
  mongodb.ts           Cached MongoDB client and database access
  rate-limit.ts        Process-level login rate limiting
  schemas.ts           Zod request schemas
scripts/
  seed.ts              Admin seed and index creation
 tests/                Vitest tests
middleware.ts          Route protection
```

## Data Model

The application uses two MongoDB collections:

- `user`: reviewer and administrator accounts. Usernames are unique and
  passwords are stored as bcrypt hashes.
- `reviews`: one document per submitted review version. Each document stores
  the reviewer, version number, current-state flag, relationships, ratings,
  traits, answers, quick choices, final rating, work-again choice, final
  sentence, and administrator response.

The seed script creates these important indexes:

- Unique username index on `user.username`.
- Unique current-review index on `reviews.reviewerId` where `isCurrent` is
  true.
- Unique version index on `reviews.reviewerId` and `version`.

## Validation and Limits

Review payloads are validated on the server with Zod. The current limits
include:

- Ratings from 1 to 10.
- At least one relationship and no more than five.
- No more than 12 predefined traits.
- Long answers up to 500 words and 4,000 characters.
- Final sentence of at least 10 characters, up to 120 words and 1,000
  characters.
- Administrator responses up to 600 words and 5,000 characters.

Client-side controls improve the writing experience, but server validation is
the authoritative boundary.

## Deployment

Mirror can be deployed as a standard Next.js application on Vercel.

1. Add `MONGODB_URI`, `JWT_SECRET`, and `NEXT_PUBLIC_SITE_URL` to the Vercel
   project for the required environments. Set `NEXT_PUBLIC_SITE_URL` to
   `https://archiveme.vercel.app`.
2. Allow the deployment to connect to MongoDB Atlas through the Atlas network
   access configuration.
3. Run the seed command once with `MONGODB_URI`,
   `ADMIN_SEED_USERNAME`, and `ADMIN_SEED_PASSWORD` set securely. This creates
   the administrator and database indexes.
4. Deploy the project and verify public, reviewer, and administrator flows.

Use a unique production JWT secret and strong administrator credentials. If a
credential has ever been committed, shared, or exposed, rotate it outside the
repository before deployment.

## Current Limitations

Mirror is an evolving private archive. The following areas remain candidates
for future work:

- JWT revocation after logout and stronger session invalidation.
- CSRF/origin hardening for browser mutation requests.
- Shared rate limiting for multi-instance deployments.
- Draft persistence and recovery after refresh.
- Search, filtering, and pagination in the administrator archive.
- Deeper version comparison and richer analytics trends.
- A dedicated controlled export endpoint beyond the current JSON surface.
- Broader API/database integration coverage in the test suite.

These limitations are tracked in `MIRROR_LIVE_FIX_TRACKER.md`. The broader
implementation audit is documented in `COMPLETE_PROJECT_AUDIT_REPORT.md`.

## Related Documentation

- `MIRROR_LIVE_FIX_TRACKER.md` - issue status, verification, and remaining work.
- `COMPLETE_PROJECT_AUDIT_REPORT.md` - security, architecture, UX, and
  production-readiness audit.
- `copilot-prompt-mirror-fullstack.md` - original product and implementation
  brief, including planned capabilities that are not all implemented yet.
