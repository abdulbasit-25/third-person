# Mirror: Technology and React Migration Guide

## 1. What this project is

Mirror is a private perception archive. Reviewers create an account, submit a structured review about Abdul Basit, and can return later to update it. An administrator signs in separately to browse current reviews, inspect analytics, and respond to reviews.

The current application is a full-stack Next.js application. It is not only a frontend: the same repository contains the rendered pages, API endpoints, authentication, validation, database access, and deployment configuration.

## 2. Current technology stack

| Area                  | Technology                                         | Role in this project                                                                   |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Application framework | Next.js 16 App Router                              | Routing, page rendering, server route handlers, middleware, and production build       |
| UI                    | React 19                                           | Components, forms, client-side state, and interactive behavior                         |
| Language              | TypeScript                                         | Type-safe page props, API code, schemas, and shared models                             |
| Styling               | Tailwind CSS 4 plus `app/globals.css`              | Utility classes, design tokens, responsive layout, animation, and accessibility styles |
| Icons                 | `lucide-react`                                     | Header and interface icons                                                             |
| Database              | MongoDB                                            | Users, versioned reviews, administrator responses, and analytics queries               |
| Authentication        | JWT, HTTP-only cookies, `jose`, and `jsonwebtoken` | Seven-day reviewer/admin sessions that are unavailable to browser JavaScript           |
| Password security     | `bcryptjs`                                         | Password hashing and comparison                                                        |
| Validation            | Zod                                                | Runtime validation for registration, login, reviews, and admin responses               |
| Abuse protection      | Local rate limiter                                 | Limits repeated login attempts                                                         |
| Testing               | Vitest                                             | Authentication, rate-limit, and schema tests                                           |
| Tooling               | ESLint, TypeScript, `tsx`                          | Linting, type checking, scripts, and database seeding                                  |
| Hosting target        | Vercel plus MongoDB Atlas                          | Serverless Next.js deployment and hosted MongoDB                                       |

The package scripts are:

```text
npm run dev       # Development server
npm run lint      # ESLint
npm run test      # Vitest
npm run build     # Production build
npm run seed      # MongoDB indexes and administrator seed
npm start         # Production server
```

## 3. How the current application is organized

```text
app/
  page.tsx                         Public landing page
  layout.tsx                       Root metadata, viewport, and global CSS
  login/, register/                Reviewer authentication pages
  review/intro/, review/new/       Protected reviewer workflow
  admin-login/                     Administrator authentication page
  dashboard/                       Protected administrator pages
  api/                             Next.js HTTP API route handlers

components/                        Reusable React UI components
  layout/Header.tsx                Shared header variants and navigation
  layout/Footer.tsx                Shared footer
  auth-form.tsx                    Client-side auth form
  review-response-form.tsx         Client-side admin response form

lib/
  auth.ts                           Hashing, JWT, cookies, and sessions
  mongodb.ts                        Reusable MongoDB connection
  schemas.ts                        Zod request schemas
  constants.ts                      Rating categories and traits
  rate-limit.ts                     Login rate limiting
  env.ts                            Environment variable validation

scripts/seed.ts                     Database indexes and admin account
tests/                              Vitest tests
```

### Rendering model

Most page files are React Server Components by default. They can render on the server without shipping their implementation to the browser. Components that use `useState`, event handlers, or browser APIs opt into client rendering with:

```tsx
"use client";
```

For example, `ReviewResponseForm` is a client component because it owns textarea state, saving state, and a `fetch()` call. The server API still performs authentication, validation, and persistence.

### Request and authentication flow

1. A reviewer submits credentials to `POST /api/auth/login`.
2. The route validates the body with Zod and compares the password with the stored bcrypt hash.
3. The server signs a JWT containing the user id and role.
4. The server sets the JWT in the `mirror_session` HTTP-only cookie.
5. Middleware redirects unauthorized requests to `/login` or `/admin-login`.
6. API handlers repeat the role check before returning or mutating private data.

The repeated API check is important. Middleware protects browser navigation, but it must not be the only protection for data endpoints.

### Review versioning

`POST /api/reviews` writes a new review version inside a MongoDB transaction. The previous current version is marked `isCurrent: false`, then the new version is inserted with an incremented `version` and `isCurrent: true`. This preserves history while making reads use the latest version.

The review payload includes:

- Relationship, duration, and interaction frequency
- Ratings from 1 to 10
- Up to 12 predefined traits
- Three written answers
- Energy and work-style choices
- Private feedback
- Final rating, willingness to work again, and a final sentence

## 4. Important security and backend boundaries

These responsibilities must remain on a trusted server:

- `MONGODB_URI` and database queries
- `JWT_SECRET` and JWT signing/verification
- Bcrypt password hashing and comparison
- Admin seed credentials
- Authorization decisions based on the session role
- Review version transactions
- Rate limiting and server-side input validation

Do not copy `lib/auth.ts`, `lib/mongodb.ts`, or `scripts/seed.ts` into a browser React bundle. Environment variables beginning with secrets must never be exposed as client configuration.

## 5. What “convert to React JS” can mean

There are two realistic meanings:

### Option A: React frontend with the existing Next.js backend

This is the lowest-risk migration. Keep the Next.js API routes, MongoDB code, authentication, and deployment. Replace or gradually rewrite the page layer as React JavaScript components. The browser continues to call the existing `/api/...` endpoints.

This is a good choice when the goal is to remove TypeScript from the UI or learn plain React without changing production behavior.

### Option B: Separate React frontend and backend

Create a React app, commonly with Vite, and move the server responsibilities into Express, Fastify, NestJS, or another server framework. The React app calls the backend over HTTP.

This is a larger architectural migration. It requires a deployment plan, API origin and CORS configuration, cookie settings, local development proxying, and an explicit strategy for protecting routes because Next.js middleware will no longer exist.

The safest sequence is Option A first, followed by Option B only if a separate frontend/backend deployment is actually needed.

## 6. Recommended target structure for a separate React JavaScript frontend

```text
client/
  src/
    main.jsx
    App.jsx
    api/
      client.js
      auth.js
      reviews.js
    components/
      layout/Header.jsx
      layout/Footer.jsx
      AuthForm.jsx
      ReviewResponseForm.jsx
    pages/
      HomePage.jsx
      LoginPage.jsx
      RegisterPage.jsx
      ReviewIntroPage.jsx
      ReviewNewPage.jsx
      DashboardPage.jsx
    auth/
      AuthProvider.jsx
      ProtectedRoute.jsx
    styles/
      globals.css

server/
  src/
    server.js
    routes/auth.js
    routes/reviews.js
    middleware/auth.js
    lib/mongodb.js
    lib/auth.js
    lib/schemas.js
```

For a staged migration, the `server/` directory is only conceptual because the current Next.js API routes can remain in `app/api`.

## 7. TypeScript TSX to JavaScript JSX conversion

The UI conversion is mostly mechanical:

| TypeScript                                  | JavaScript                                     |
| ------------------------------------------- | ---------------------------------------------- |
| `.tsx` file                                 | `.jsx` file                                    |
| `import type { ReactNode }`                 | Remove the type-only import                    |
| `const value: string`                       | `const value`                                  |
| `function Page({ id }: Props)`              | `function Page({ id })`                        |
| `useState<string>("")`                      | `useState("")`                                 |
| `as const`                                  | Remove it, or use a normal JavaScript constant |
| Type unions such as `"admin" \| "reviewer"` | Runtime checks or documented constants         |
| `LayoutProps<"/">`                          | Plain props or no annotation                   |

Example conversion from the existing response form:

```jsx
import { useState } from "react";

export function ReviewResponseForm({ reviewId, initialResponse = "" }) {
  const [response, setResponse] = useState(initialResponse);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const result = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminResponse: response }),
      });
      const body = await result.json();
      setStatus(result.ok ? "Response saved." : body.error);
    } catch {
      setStatus("The server could not be reached.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <textarea
        value={response}
        onChange={(event) => setResponse(event.target.value)}
      />
      <button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save response"}
      </button>
      <span>{status}</span>
    </div>
  );
}
```

This removes static types only. It does not remove runtime validation. Keep the Zod schema on the server, and optionally use a shared schema package if the client also needs early validation.

## 8. Routing conversion

Next.js file routes map to a client router such as `react-router-dom`:

| Current Next route      | React Router route      | Component         |
| ----------------------- | ----------------------- | ----------------- |
| `/`                     | `/`                     | `HomePage`        |
| `/login`                | `/login`                | `LoginPage`       |
| `/register`             | `/register`             | `RegisterPage`    |
| `/review/intro`         | `/review/intro`         | `ReviewIntroPage` |
| `/review/new`           | `/review/new`           | `ReviewNewPage`   |
| `/admin-login`          | `/admin-login`          | `AdminLoginPage`  |
| `/dashboard`            | `/dashboard`            | `DashboardPage`   |
| `/dashboard/people/:id` | `/dashboard/people/:id` | `PersonPage`      |
| `/dashboard/reviews`    | `/dashboard/reviews`    | `ReviewsPage`     |
| `/dashboard/analytics`  | `/dashboard/analytics`  | `AnalyticsPage`   |
| `/dashboard/export`     | `/dashboard/export`     | `ExportPage`      |
| `/dashboard/timeline`   | `/dashboard/timeline`   | `TimelinePage`    |

Minimal router setup:

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Use a `ProtectedRoute` component for user experience, but keep authorization in backend middleware and every private API handler. A frontend redirect is not a security boundary.

## 9. Authentication choices after the split

The current HTTP-only cookie model can be preserved. The backend sets the cookie, and the React client sends it with requests:

```js
fetch(`${API_URL}/api/auth/me`, {
  credentials: "include",
});
```

For cross-origin development or deployment, configure all of these together:

- Backend CORS with the exact frontend origin
- `credentials: true` on the server and `credentials: "include"` in fetch
- Cookie `SameSite`, `Secure`, `Domain`, and `Path` values
- HTTPS in production
- CSRF protection for state-changing requests if the deployment makes cookies cross-site

Avoid storing the JWT in `localStorage` merely because the frontend is separate. That makes token theft through an XSS vulnerability substantially easier. An HTTP-only cookie is the better default for this application.

## 10. API client layer

Do not scatter raw `fetch()` calls through every page. Create a small client that centralizes the API origin, cookies, JSON parsing, and error handling:

```js
const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "The request failed.");
  }
  return body;
}
```

Then expose domain functions such as `loginReviewer`, `getCurrentSession`, `submitReview`, and `saveAdminResponse`. This keeps UI components concerned with user interaction rather than URL construction.

## 11. Styling migration

The current visual system is already portable because most styling is Tailwind utility markup and the shared CSS variables live in `app/globals.css`.

When moving to Vite React:

1. Copy the design tokens and global accessibility rules into `src/styles/globals.css`.
2. Configure Tailwind CSS 4 for the new source directory.
3. Replace `next/link` with `Link` from `react-router-dom`, or use regular anchors for external links.
4. Replace any Next image/font utilities with normal browser elements or an equivalent asset strategy.
5. Keep the existing header variants, responsive behavior, focus rings, reduced-motion rules, and color variables.
6. Keep icons from `lucide-react`; they are already framework-independent React components.

## 12. Step-by-step migration plan

### Phase 1: Record the current contract

- Run `npm run lint`, `npm run test`, `npx tsc --noEmit`, and `npm run build`.
- Record every API request, response shape, status code, and protected role.
- Confirm MongoDB indexes and the review versioning behavior.

### Phase 2: Extract shared runtime concepts

- Keep the current Zod schemas and constants as the backend source of truth.
- Document API types in a shared `api-contract.md` or OpenAPI specification.
- Add tests for unauthorized, wrong-role, invalid-payload, and concurrent-review cases.

### Phase 3: Create the React shell

- Create a Vite React JavaScript app.
- Add `react-router-dom`, `lucide-react`, and the existing Tailwind setup.
- Move global styles, the header, footer, and public landing page first.
- Use a development proxy so `/api` still reaches the existing Next.js server.

### Phase 4: Move public and auth pages

- Convert registration and login forms from TSX to JSX.
- Keep calls pointed at the existing API routes.
- Add an `AuthProvider` that calls `/api/auth/me` on startup.
- Show loading and unauthorized states before rendering protected routes.

### Phase 5: Move reviewer workflow

- Convert the intro and six-step review composer.
- Keep form state in React and submit the same review payload.
- Preserve server validation, word limits, rating limits, and transaction behavior.
- Verify that updating a review creates a new version and leaves historical versions intact.

### Phase 6: Move administrator workflow

- Convert dashboard overview, people, reviews, timeline, analytics, and export pages.
- Preserve the admin-only API checks.
- Convert `ReviewResponseForm` and verify PATCH error handling, loading, and success states.

### Phase 7: Decide the backend split

- If Next.js remains the backend, deploy the React build and API together or behind a reverse proxy.
- If moving to Express/Fastify, port route logic without changing the API contract first.
- Move MongoDB, auth, rate limiting, and seed code only into the server package.
- Configure cookie/CORS behavior and test production-like HTTPS locally.

### Phase 8: Remove Next.js after parity

Remove the Next page layer only after both roles, all routes, authentication, review versioning, admin response writes, analytics, export, and error states have been verified against the current application.

## 13. Suggested validation checklist

- Reviewer can register, log in, log out, and load the current session.
- Invalid credentials are rejected with the expected status and message.
- Rate limiting still blocks repeated login attempts.
- Reviewer routes cannot be opened by anonymous users or administrators.
- Administrator routes cannot be opened by reviewers.
- Review payload limits are enforced on the server.
- Creating an updated review marks exactly one version as current.
- Admin review responses are persisted and displayed after reload.
- MongoDB secrets and JWT secrets never appear in the browser bundle.
- Cookies work with the actual frontend/backend deployment origins.
- Keyboard focus, reduced motion, responsive layout, and error states remain intact.

## 14. Bottom line

The UI can be converted from TSX to JSX and from Next page routes to React Router routes, but the application cannot safely become frontend-only. The practical architecture is:

```text
React JavaScript frontend
        |
        | HTTP requests with an HTTP-only session cookie
        v
Trusted API/backend
        |
        +-- JWT and bcrypt authentication
        +-- Zod validation
        +-- MongoDB and transactions
        +-- Rate limiting and authorization
```

Start by migrating the UI against the existing API. That preserves behavior, limits the first change set, and makes any later backend separation an explicit second project rather than mixing two migrations together.
