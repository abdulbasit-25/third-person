# MIRROR — LIVE FIX & IMPROVEMENT TRACKER

> **Purpose:** This file is the working control document for fixing the Mirror project.
>
> **Repository:** https://github.com/abdulbasit-25/third-person
>
> **Rule:** Audit → Fix → Verify → Update this file → Move to the next issue.
>
> **Important:** Do not merely describe fixes. Actually modify the project, run the relevant checks, and keep this document synchronized with the real state of the repository.

---

## 1. HOW TO USE THIS FILE

You are operating as a senior full-stack engineer, security engineer, QA engineer, and product engineer.

The project has already been audited. The audit identified security issues, data-integrity problems, incomplete functionality, unused functionality, UX problems, performance issues, testing gaps, and missing features.

Your job now is to **start fixing the project systematically**.

### Core loop

For every issue:

1. Read the relevant source files.
2. Understand the existing implementation before changing it.
3. Fix the issue properly rather than applying a superficial workaround.
4. Check for side effects and related code paths.
5. Run the most relevant validation.
6. Run broader checks when appropriate.
7. Update the table in this file immediately.
8. Record what changed and how it was verified.
9. Continue to the next unresolved issue.

Do not stop after producing a plan.

---

# 2. STATUS DEFINITIONS

Use only these statuses:

- 🔴 **UNSOLVED** — Not fixed yet.
- 🟡 **IN PROGRESS** — Currently being worked on.
- 🟢 **SOLVED** — Fixed and verified.
- 🟠 **PARTIALLY SOLVED** — Some aspects fixed, but more work remains.
- ⚪ **BLOCKED** — Cannot safely complete because an external dependency, credential, deployment, or decision is required.
- 🔵 **WONT FIX** — Deliberately not fixing after evaluating the issue; explain why.

Never mark an issue SOLVED merely because code was changed.

A fix is SOLVED only after appropriate verification.

---

# 3. LIVE PROBLEM TRACKER

| ID    | Priority | Area           | Problem                                                                            | Status              | Files / Location                                                      | Verification                                                             | Notes                                                                                                                                                                                                |
| ----- | -------- | -------------- | ---------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 | P0       | Security       | Hardcoded administrator credentials in seed script                                 | 🟢 SOLVED           | `scripts/seed.ts`, `README.md`                                        | `npm run lint`, `npx tsc --noEmit`, `npm run build`, source scan         | Credentials are now required at seed time through shell/deployment environment variables and are not stored in source or `.env.example`.                                                             |
| P0-02 | P0       | Security       | Exposed administrator credential must be rotated                                   | ⚪ BLOCKED          | Deployment / MongoDB / environment                                    | Source fix verified; external rotation pending                           | Rotate the administrator password and MongoDB credentials outside the repository, then run the seed with the new values.                                                                             |
| P0-03 | P0       | Data integrity | Concurrent review submissions can create duplicate versions/current-state problems | 🟠 PARTIALLY SOLVED | `app/api/reviews/route.ts`, `scripts/seed.ts`                         | `npm run lint`, `npx tsc --noEmit`, `npm run build`                      | Reads now occur inside the transaction; duplicate writes return `409`; seed upgrades to unique current/version indexes. Run the seed after credential rotation to activate the database constraints. |
| P0-04 | P0       | Validation     | Review schema accepts arbitrary keys / oversized nested values                     | 🟢 SOLVED           | `lib/schemas.ts`, `app/review/new/page.tsx`                           | Direct schema probe, `npm run lint`, `npx tsc --noEmit`, `npm run build` | Known keys/enums, strict objects, 1-10 ratings, 500-word/4000-character long answers, and 120-word/1000-character final sentence are enforced.                                                       |
| P0-05 | P0       | Testing        | No automated test suite                                                            | 🟠 PARTIALLY SOLVED | `tests/auth.test.ts`, `tests/schemas.test.ts`, `package.json`         | `npm test` — 5 tests passed                                              | Initial session and schema coverage exists; API/database/concurrency integration tests remain.                                                                                                       |
| P1-01 | P1       | Security       | Login has no brute-force/rate-limit protection                                     | 🟠 PARTIALLY SOLVED | `app/api/auth/login/route.ts`, `lib/rate-limit.ts`                    | `npm test` — 6 passed; lint/typecheck/build pass                         | Reviewer login is limited to 10 attempts per 15-minute window per process/IP. A shared store is still needed for reliable multi-instance Vercel enforcement.                                         |
| P1-02 | P1       | Security       | Admin login has no brute-force/rate-limit protection                               | 🟠 PARTIALLY SOLVED | `app/api/auth/admin-login/route.ts`, `lib/rate-limit.ts`              | `npm test` — 6 passed; lint/typecheck/build pass                         | Admin login is limited to 10 attempts per 15-minute window per process/IP. A shared store is still needed for reliable multi-instance Vercel enforcement.                                            |
| P1-03 | P1       | Authentication | Stolen JWT remains usable after logout                                             | 🔴 UNSOLVED         | `lib/auth.ts`                                                         | —                                                                        | Improve token/session invalidation strategy.                                                                                                                                                         |
| P1-04 | P1       | Security       | Browser mutation requests lack CSRF/origin hardening                               | 🔴 UNSOLVED         | Review mutation APIs / middleware                                     | —                                                                        | Implement an appropriate origin/CSRF defense without breaking legitimate requests.                                                                                                                   |
| P1-05 | P1       | Security       | Sensitive server pages should verify authorization independently of middleware     | 🔴 UNSOLVED         | Protected server pages                                                | —                                                                        | Add defense-in-depth session checks before sensitive queries.                                                                                                                                        |
| P1-06 | P1       | Review UX      | Required review choices are not consistently enforced                              | 🟠 PARTIALLY SOLVED | `app/review/new/page.tsx`, `lib/schemas.ts`                           | Build and schema validation pass                                         | Relationship and final sentence are enforced; more step-specific required-state UX remains.                                                                                                          |
| P1-07 | P1       | Review UX      | Refresh loses review progress                                                      | 🔴 UNSOLVED         | `app/review/new/page.tsx`                                             | —                                                                        | Add safe draft persistence/recovery.                                                                                                                                                                 |
| P1-08 | P1       | Review UX      | Final submit can be triggered repeatedly                                           | 🟠 PARTIALLY SOLVED | `app/review/new/page.tsx`                                             | `npm run lint`, `npm run build`                                          | Client submit button is disabled while saving; server-side idempotency remains unresolved.                                                                                                           |
| P1-09 | P1       | Review UX      | Submission errors are too generic                                                  | 🔴 UNSOLVED         | Review API/UI                                                         | —                                                                        | Separate validation, auth, conflict, and server errors.                                                                                                                                              |
| P1-10 | P1       | Review         | Several documented review questions/capabilities are missing or disconnected       | 🟠 PARTIALLY SOLVED | `app/review/new/page.tsx`, `lib/schemas.ts`                           | Build and direct schema probe pass                                       | First-impression and long-answer fields are connected; the broader documented question set is still incomplete.                                                                                      |
| P1-11 | P1       | Export         | Export is not a proper controlled export endpoint                                  | 🔴 UNSOLVED         | `app/dashboard/export/page.tsx`, review APIs                          | —                                                                        | Implement reliable JSON export and CSV if appropriate.                                                                                                                                               |
| P1-12 | P1       | Review history | Reviewer history API exists but has no UI                                          | 🔴 UNSOLVED         | `app/api/reviews/mine/route.ts`                                       | —                                                                        | Connect useful history functionality to reviewer experience.                                                                                                                                         |
| P1-13 | P1       | API            | Operational/database failures are sometimes returned as validation errors          | 🔴 UNSOLVED         | API routes                                                            | —                                                                        | Normalize error classification/status codes.                                                                                                                                                         |
| P1-14 | P1       | Documentation  | README does not match current implementation                                       | 🟢 SOLVED           | `README.md`                                                           | Manual documentation review                                              | Seed-time variables and review word/character limits are documented; broader documentation cleanup remains possible.                                                                                 |
| P2-01 | P2       | Admin          | No search/filtering across archive data                                            | 🔴 UNSOLVED         | Dashboard/API                                                         | —                                                                        | Add useful search/filter controls.                                                                                                                                                                   |
| P2-02 | P2       | Admin          | No pagination                                                                      | 🔴 UNSOLVED         | Dashboard/API                                                         | —                                                                        | Avoid loading all records at once.                                                                                                                                                                   |
| P2-03 | P2       | Admin          | Review detail experience is shallow                                                | 🟠 PARTIALLY SOLVED | `app/dashboard/reviews/page.tsx`                                      | `npm test` — 6 passed; lint/typecheck/build pass                         | Admin Reviews now shows every stored version and limits responses to the latest; deeper comparison/detail controls remain.                                                                           |
| P2-04 | P2       | Admin          | Reviewer profiles/context are limited                                              | 🟠 PARTIALLY SOLVED | `app/dashboard/people/page.tsx`, `app/dashboard/people/[id]/page.tsx` | `npm test` — 6 passed; lint/typecheck/build pass                         | Reviewer names now open a private history page with the latest review emphasized and older versions dated below.                                                                                     |
| P2-05 | P2       | Versioning     | No version comparison UI                                                           | 🔴 UNSOLVED         | Reviewer/admin review history                                         | —                                                                        | Compare meaningful changes between versions.                                                                                                                                                         |
| P2-06 | P2       | Analytics      | Analytics only provide basic averages                                              | 🔴 UNSOLVED         | Analytics page/API                                                    | —                                                                        | Add useful trends, distributions, traits, and insights without overcomplicating the product.                                                                                                         |
| P2-07 | P2       | Architecture   | Analytics/database queries are duplicated                                          | 🔴 UNSOLVED         | Analytics pages/API                                                   | —                                                                        | Centralize reusable server-side query logic.                                                                                                                                                         |
| P2-08 | P2       | Architecture   | Review wizard is too large                                                         | 🔴 UNSOLVED         | `app/review/new/page.tsx`                                             | —                                                                        | Split into maintainable step components without changing behavior unnecessarily.                                                                                                                     |
| P2-09 | P2       | Architecture   | Dashboard layouts/headers contain duplication                                      | 🔴 UNSOLVED         | Dashboard pages/components                                            | —                                                                        | Extract shared components where it genuinely improves maintainability.                                                                                                                               |
| P2-10 | P2       | Database       | Index creation depends on seed script                                              | 🔴 UNSOLVED         | Database setup / seed                                                 | —                                                                        | Make production index setup reliable and explicit.                                                                                                                                                   |
| P2-11 | P2       | Database       | Database name is hardcoded instead of respecting configuration                     | 🔴 UNSOLVED         | `lib/mongodb.ts`                                                      | —                                                                        | Improve configuration while preserving existing environments.                                                                                                                                        |
| P2-12 | P2       | Database       | No migration strategy                                                              | 🔴 UNSOLVED         | Project-wide                                                          | —                                                                        | Add only if justified by the current data model and deployment workflow.                                                                                                                             |
| P2-13 | P2       | Reliability    | No backup/recovery procedure                                                       | 🔴 UNSOLVED         | Operations/scripts                                                    | —                                                                        | Document and/or implement an appropriate strategy.                                                                                                                                                   |
| P2-14 | P2       | UX             | Missing explicit loading/error/empty states in archive pages                       | 🔴 UNSOLVED         | Dashboard pages                                                       | —                                                                        | Add polished states throughout.                                                                                                                                                                      |
| P2-15 | P2       | Accessibility  | Form errors/values/focus behavior need improvement                                 | 🔴 UNSOLVED         | Review/auth forms                                                     | —                                                                        | Improve semantic/accessibility behavior.                                                                                                                                                             |
| P2-16 | P2       | Code quality   | Loose review payload types and inconsistent constant/schema enforcement            | 🔴 UNSOLVED         | `lib/constants.ts`, `lib/schemas.ts`, review code                     | —                                                                        | Establish one authoritative model.                                                                                                                                                                   |
| P2-17 | P2       | Dead code      | `firstImpression` state appears unused                                             | 🟢 SOLVED           | `app/review/new/page.tsx`                                             | `npm run lint`, `npx tsc --noEmit`, `npm run build`                      | First impression is now collected, limited, submitted, and displayed in the admin review view.                                                                                                       |
| P2-18 | P2       | Dead code      | `workStyle` state appears unused                                                   | 🔴 UNSOLVED         | `app/review/new/page.tsx`                                             | —                                                                        | Either connect it to the product or remove it.                                                                                                                                                       |
| P2-19 | P2       | Dead code      | `privateFeedback` is always submitted empty                                        | 🔴 UNSOLVED         | Review schema/payload                                                 | —                                                                        | Decide whether this feature should exist and implement/remove consistently.                                                                                                                          |
| P2-20 | P2       | Dead code      | Some rating categories are defined but not displayed                               | 🟠 PARTIALLY SOLVED | `lib/constants.ts`, `lib/schemas.ts`, `app/review/new/page.tsx`       | Direct schema probe, build                                               | Unknown categories are rejected; the wizard still displays only a subset of the defined categories.                                                                                                  |
| P2-21 | P2       | Dead code      | Analytics summary API is disconnected from analytics UI                            | 🔴 UNSOLVED         | `app/api/analytics/summary/route.ts`                                  | —                                                                        | Reuse it or remove it after confirming the best architecture.                                                                                                                                        |
| P2-22 | P2       | Dead code      | Review response timestamps are stored but poorly surfaced                          | 🔴 UNSOLVED         | Review/admin UI                                                       | —                                                                        | Make useful or remove unnecessary behavior.                                                                                                                                                          |
| P2-23 | P2       | Navigation     | Deployed archive navigation appears to log the administrator out in the browser    | 🟠 PARTIALLY SOLVED | `app/dashboard/page.tsx`                                              | Deployed cookie-preserving HTTP smoke test passed; local build passed    | Replaced raw archive anchors with Next `Link` navigation. Redeploy and verify in the browser; direct deployed requests already preserve the session.                                                 |
| P3-01 | P3       | Product        | Invitation links                                                                   | 🔴 UNSOLVED         | Future feature                                                        | —                                                                        | Consider after core reliability/security work.                                                                                                                                                       |
| P3-02 | P3       | Product        | CSV/PDF export                                                                     | 🔴 UNSOLVED         | Future feature                                                        | —                                                                        | CSV is likely more useful before PDF.                                                                                                                                                                |
| P3-03 | P3       | Product        | Sentiment/theme analysis                                                           | 🔴 UNSOLVED         | Future analytics                                                      | —                                                                        | Do not add until data quality is strong enough.                                                                                                                                                      |
| P3-04 | P3       | Product        | Reviewer anonymity controls                                                        | 🔴 UNSOLVED         | Future data model/UI                                                  | —                                                                        | Evaluate privacy implications before implementation.                                                                                                                                                 |
| P3-05 | P3       | Product        | Recurring review/invitation workflow                                               | 🔴 UNSOLVED         | Future feature                                                        | —                                                                        | Only after the core review lifecycle is stable.                                                                                                                                                      |

---

# 4. EXISTING FEATURES THAT MUST NOT BE FORGOTTEN

These already exist or have meaningful implementation and should be preserved unless there is a strong reason to change them:

- Reviewer authentication
- Admin authentication
- Protected routes
- MongoDB persistence
- Multi-step review wizard
- Review versioning
- Admin archive/dashboard
- Analytics
- Timeline
- Review responses
- Reviewer history API
- Analytics summary API
- Export page
- Database indexes
- Password hashing
- HTTP-only authentication cookies

Before deleting or replacing any of these, determine whether they can be reused.

---

# 5. IMPORTANT UNUSED / UNDERUTILIZED FEATURES

Audit these explicitly during implementation:

| Feature               | Current Situation                                        | Required Decision         |
| --------------------- | -------------------------------------------------------- | ------------------------- |
| Reviewer history API  | Exists but no frontend consumer                          | Integrate or remove       |
| Analytics summary API | Exists but UI uses another query                         | Centralize or remove      |
| `firstImpression`     | State exists but is not meaningfully collected/displayed | Implement or remove       |
| `workStyle`           | State exists but is not collected                        | Implement or remove       |
| `privateFeedback`     | Persisted/submitted as empty                             | Implement or remove       |
| Rating categories     | Some constants are not represented in the UI             | Reconcile                 |
| Review timestamps     | Stored but not meaningfully surfaced                     | Improve display if useful |
| Response timestamp    | Stored but not meaningfully surfaced                     | Improve display if useful |

---

# 6. FIXING RULES

## Rule 1 — Do not rewrite blindly

Understand the existing architecture first.

Do not replace working systems simply because you would personally build them differently.

## Rule 2 — Security first

Always prioritize:

1. Credential exposure
2. Authentication/authorization
3. Data integrity
4. Input validation
5. Abuse protection
6. Data privacy

## Rule 3 — Database constraints matter

Do not rely solely on application logic for uniqueness or integrity when MongoDB can enforce the invariant.

## Rule 4 — Server validation is authoritative

Client-side validation improves UX.

It must never be treated as the security boundary.

## Rule 5 — Don't create unnecessary dependencies

Before adding a package, check whether the current dependencies can solve the problem.

If adding one is genuinely necessary, document why.

## Rule 6 — Preserve the design

Improve the existing Mirror visual identity rather than replacing the entire UI with a generic dashboard template.

## Rule 7 — Don't over-engineer

Mirror is a focused private perception/review archive.

Do not turn it into a massive social network or enterprise analytics platform.

## Rule 8 — Verify every fix

At minimum, run the relevant:

- TypeScript check
- Lint
- Build
- Tests
- Targeted runtime/API check

depending on what was changed.

---

# 7. BEFORE STARTING

Read:

- `README.md`
- package configuration
- environment/configuration files
- authentication implementation
- MongoDB implementation
- schemas/constants
- review API
- auth APIs
- dashboard APIs/pages
- review wizard
- existing tests/scripts

Then compare the actual implementation against this tracker.

Do not assume the previous audit is perfect.

If you discover a new issue that is not in this document:

1. Add a new row.
2. Assign priority.
3. Fix it if it belongs in the current scope.
4. Record verification.

---

# 8. START HERE — P0 ORDER

Work through these in order:

### P0-01 — Remove hardcoded administrator credentials

- Move seed credentials out of source code.
- Use secure environment variables or another appropriate seed mechanism.
- Never print the password.
- Update documentation.
- Check `.gitignore` and environment handling.
- Explain that already-exposed credentials must be rotated externally.

### P0-03 — Fix review concurrency/data integrity

- Analyze the existing transaction.
- Ensure version allocation is safe.
- Ensure only one current review can exist per reviewer.
- Add appropriate unique/partial indexes.
- Consider duplicate submissions and retry behavior.
- Do not create an integrity solution that breaks legitimate review updates.

### P0-04 — Strict review validation

- Make objects strict where appropriate.
- Allow only known rating/trait/answer keys.
- Enforce maximum lengths.
- Validate enum values.
- Reject unexpected payload fields.
- Keep client and server validation aligned.

### P0-05 — Establish automated testing

Start with the highest-risk behavior:

- Registration
- Login
- Admin/reviewer role separation
- Protected routes
- Reviewer ownership
- Review creation
- Review updates
- Versioning
- Validation
- Admin-only APIs
- Logout/session behavior

---

# 9. AFTER EACH FIX

Immediately update the relevant row.

Example:

```md
| P0-04 | P0 | Validation | Review schema accepts arbitrary keys / oversized nested values | 🟢 SOLVED | `lib/schemas.ts` | `npm test`, `npx tsc --noEmit`, targeted API validation | Strict schemas and max lengths added; unexpected fields rejected. |
```

Also add a short changelog entry below.

---

# 10. LIVE CHANGELOG

Newest changes go at the top.

| Date       | ID                                                     | Change                                                                                                                                                                                                                              | Verification                                                                                              |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 2026-09-07 | P2-04                                                  | Added clickable reviewer sections and a latest-first reviewer history page. First Impression, Proud Moment, and Honest Advice headings are now explicit and bold.                                                                   | `npm test` — 6 passed; `npm run lint`; `npx tsc --noEmit`; `npm run build`                                |
| 2026-09-07 | P2-03                                                  | Admin Reviews now loads every stored version, labels archived/latest entries, and only allows responses on the latest version. Strengthened display heading weight, contrast, spacing, and text wrapping.                           | `npm test` — 6 passed; `npm run lint`; `npx tsc --noEmit`; `npm run build`                                |
| 2026-09-07 | P1-01, P1-02                                           | Added shared reviewer/admin login rate limiting with a 10-attempt/15-minute window and `Retry-After` responses.                                                                                                                     | `npm test` — 6 passed; `npm run lint`; `npx tsc --noEmit`; `npm run build`                                |
| 2026-09-07 | P0-05, P2-23                                           | Added initial Vitest coverage for session/schema boundaries and replaced raw archive anchors with Next client navigation to avoid unnecessary document reloads.                                                                     | `npm test` — 5 passed; `npm run lint`; `npx tsc --noEmit`; `npm run build`; deployed archive smoke test   |
| 2026-09-07 | P0-03                                                  | Moved current-review/version allocation inside the transaction, added conflict/server error handling, and configured unique current/version indexes in the seed migration.                                                          | `npm run lint`, `npx tsc --noEmit`, `npm run build`; database activation pending rotated seed credentials |
| 2026-09-07 | P0-01, P0-04, P1-06, P1-08, P1-10, P1-14, P2-17, P2-20 | Removed the hardcoded seed credential, added strict review validation and explicit limits, connected first-impression/long responses, rendered all submitted answer paragraphs in the admin review view, and documented the limits. | `npm run lint`, `npx tsc --noEmit`, `npm run build`, direct schema probe, source secret scan              |
| 2026-09-07 | —                                                      | Audit imported into live tracker. No fixes performed yet.                                                                                                                                                                           | Initial state                                                                                             |

---

# 11. DISCOVERED PROBLEMS

Add newly discovered issues here before fixing them.

| ID  | Priority | Problem                           | Status | Location | Notes                          |
| --- | -------- | --------------------------------- | ------ | -------- | ------------------------------ |
| —   | —        | No additional issue recorded yet. | —      | —        | Add issues here as discovered. |

---

# 12. VERIFICATION LOG

Keep a running record of project-wide checks.

| Date       | Check                                   | Result           | Notes                                                                                                                                     |
| ---------- | --------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-07 | Review schema boundary probe            | ✅ PASS          | Valid payload accepted; unknown keys, unknown ratings, short final sentence, and 501-word answer rejected                                 |
| 2026-09-07 | Source credential scan                  | ✅ PASS          | No administrator password remains in `scripts`, `lib`, `app`, or `components`                                                             |
| 2026-09-07 | `npm run lint`                          | ✅ PASS          | Baseline audit result                                                                                                                     |
| 2026-09-07 | `npx tsc --noEmit`                      | ✅ PASS          | Baseline audit result                                                                                                                     |
| 2026-09-07 | `npm run build`                         | ✅ PASS          | Baseline audit result                                                                                                                     |
| 2026-09-07 | `npm run seed` without seed credentials | ⚠️ EXPECTED FAIL | Script now fails closed and requires `ADMIN_SEED_USERNAME` and `ADMIN_SEED_PASSWORD`; external credential rotation is still blocked       |
| 2026-09-07 | Review transaction integrity code       | ✅ PASS          | Current review is read inside the transaction; duplicate-key conflicts map to `409`; unique indexes are configured for the seed migration |
| 2026-09-07 | `npm test`                              | ✅ PASS          | 2 test files and 5 tests passed: session token behavior and strict review validation                                                      |
| 2026-09-07 | `npm test` after rate limiting          | ✅ PASS          | 3 test files and 6 tests passed, including login attempt limiting                                                                         |
| 2026-09-07 | Archive navigation smoke test           | ✅ PASS          | Authenticated admin session reached all deployed archive URLs with `200`; local links now use Next `Link`                                 |

After every meaningful batch of changes, rerun relevant checks and update this table.

---

# 13. FINAL DEFINITION OF DONE

The project is not "done" merely because all code compiles.

Before declaring the current fixing phase complete:

- [ ] No hardcoded secrets
- [ ] Exposed credentials have been identified for rotation
- [ ] Authentication is tested
- [ ] Authorization is tested
- [ ] Reviewer ownership is tested
- [ ] Review validation is strict
- [ ] Review versioning is concurrency-safe
- [ ] Database integrity constraints exist
- [ ] Duplicate submission behavior is safe
- [ ] Login abuse protection exists
- [ ] Mutation security is hardened
- [ ] Review progress recovery works
- [ ] Export works correctly
- [ ] Reviewer history is useful
- [ ] Admin review details are useful
- [ ] Search/filter/pagination are implemented where needed
- [ ] Analytics are accurate and useful
- [ ] Dead/unused functionality has been intentionally integrated or removed
- [ ] Loading/error/empty states are polished
- [ ] Accessibility issues are addressed
- [ ] Automated tests cover critical behavior
- [ ] Lint passes
- [ ] TypeScript passes
- [ ] Production build passes
- [ ] Documentation matches reality

---

# 14. MOST IMPORTANT INSTRUCTION

**KEEP THIS FILE ALIVE.**

This is not a one-time checklist.

As you work on the repository, continuously update:

- Problem status
- Newly discovered problems
- Resolved problems
- Files changed
- Verification results
- Changelog
- Remaining work

At any point, this file should accurately answer:

> **What is still broken?**
>
> **What has been fixed?**
>
> **What was changed?**
>
> **How was it verified?**
>
> **What should be fixed next?**

Never leave the tracker stale after making a fix.

---

# 15. START NOW

Do not ask me to manually choose the first issue.

Start with **P0-01**.

Inspect the repository, implement the fix, verify it, update this file, and then continue through the P0 issues.

When you encounter something that genuinely requires an external action I must perform (for example rotating a production secret), mark it **⚪ BLOCKED**, explain the exact action required, and continue fixing everything else that can safely be completed in the repository.

**Do not just give me instructions. Work on the codebase.**
