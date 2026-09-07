# Mirror

Mirror is a private perception archive for Abdul Basit. People who know him can
create an account, submit a considered review, and return later to update it.
The administrator can sign in to review the current archive and its analytics.

Built with Next.js App Router, TypeScript, MongoDB, JWT cookies, bcryptjs, and
Zod validation.

## Features

- Public landing page explaining the archive
- Reviewer registration and login
- Six-step review flow with ratings, traits, and written feedback
- Versioned reviews with only the latest version marked current
- Private administrator login and review dashboard
- MongoDB indexes created by the seed script

## Requirements

- Node.js 20 or newer
- A MongoDB database, local or hosted

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mirror
JWT_SECRET=replace-with-a-random-string-at-least-32-characters-long
```

`MONGODB_URI` and `JWT_SECRET` are required by the application. The two
`ADMIN_SEED_*` values are required only by `npm run seed`; keep them in the
current shell or deployment secret manager and do not add them to the checked-
in environment example.

The review form accepts one or more relationships, ratings from 1 to 10, up to
12 predefined traits, and written responses up to 500 words / 4,000
characters. The final sentence must contain 10-120 words and no more than 1,000
characters. Administrator responses allow up to 600 words / 5,000 characters.

## Commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run seed      # Create indexes and seed the administrator account
npm start         # Serve the production build
```

Open [http://localhost:3000](http://localhost:3000) after starting the dev
server.

## Main routes

| Route           | Purpose                                |
| --------------- | -------------------------------------- |
| `/`             | Public introduction to Mirror          |
| `/register`     | Create a reviewer account              |
| `/login`        | Reviewer login                         |
| `/review/intro` | Review invitation and flow entry point |
| `/review/new`   | Submit or update a review              |
| `/admin-login`  | Administrator login                    |
| `/dashboard`    | Private administrator dashboard        |

## Project structure

- `app/` contains pages and API route handlers.
- `components/` contains shared UI components.
- `lib/auth.ts` manages JWT sessions and cookies.
- `lib/mongodb.ts` provides the MongoDB connection.
- `lib/schemas.ts` defines request validation schemas.
- `scripts/seed.ts` loads `.env.local`, creates indexes, and seeds the admin.

## Security

Keep `.env.local` out of version control. Use a unique production `JWT_SECRET`
and rotate any credentials that have been exposed outside your local machine.

Set `MONGODB_URI` to an Atlas connection string and `JWT_SECRET` to a random value with at least 32 characters. For the admin seed, set `ADMIN_SEED_USERNAME` and `ADMIN_SEED_PASSWORD` only in the current shell, then run:

```bash
npm run seed
npm run dev
```

Open `http://localhost:3000`. Reviewer registration is available at `/register`; the private administrator entry is `/admin-login`.

## Deployment

Import the repository into Vercel as a Next.js project. Add `MONGODB_URI` and `JWT_SECRET` for Production, Preview, and Development in Project Settings. Atlas network access must allow Vercel serverless connections, commonly with `0.0.0.0/0` on a protected database user. Use a separate database name for preview development.

## Current surfaces

- Mirror landing page with responsive editorial design system
- Reviewer registration, login, session cookie, intro, and six-step review composer
- Versioned review writes using a MongoDB transaction
- Reviewer history endpoint and admin review/analytics endpoints
- Admin seed script, protected dashboard, and environment validation

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deployment.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
