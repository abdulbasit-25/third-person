# COMPLETE PROJECT AUDIT — MIRROR

You are auditing the **entire Mirror project**, not just individual files.

Repository:
https://github.com/abdulbasit-25/third-person

The project is a private perception/review archive where people who know me can create an account, submit a thoughtful review about me, potentially return later to update that review, while I have a private administrator dashboard where I can view, analyze, manage, and eventually export the collected feedback.

## YOUR ROLE

Act as a combination of:

- Senior full-stack engineer
- Software architect
- QA engineer
- Security auditor
- UX/UI reviewer
- Product manager
- Performance engineer
- Code reviewer

Do a **complete audit of the repository before suggesting changes**.

Do NOT assume the README, comments, route names, or existing documentation are correct.

Verify everything against the actual implementation.

---

# 1. FIRST: UNDERSTAND THE ENTIRE PROJECT

Inspect the entire repository and understand:

- Every folder
- Every page
- Every component
- Every API route
- Every server action
- Every database operation
- Every schema
- Every validation layer
- Authentication
- Authorization
- Middleware
- Cookies/sessions
- Admin functionality
- Reviewer functionality
- Review submission flow
- Review editing/versioning
- Analytics
- Error handling
- Loading states
- Empty states
- Responsive behavior
- Navigation
- UI components
- Utility functions
- Configuration
- Environment variables
- Scripts
- Dependencies
- Build configuration
- Deployment configuration
- Documentation

Follow the code paths rather than simply listing files.

For every major feature, determine:

**UI → client logic → API/server action → validation → database → response → UI**

and verify that the complete chain actually works.

---

# 2. CREATE A FEATURE INVENTORY

Create a complete inventory of every feature currently present.

For each feature, classify it as:

### WORKING
Fully implemented and actually functional.

### PARTIALLY WORKING
Exists but has bugs, missing pieces, weak error handling, incomplete UX, or edge cases.

### BROKEN
Exists but does not function correctly.

### DEAD / UNUSED
Implemented somewhere in the codebase but never actually used or reachable.

### DOCUMENTATION ONLY
Mentioned in README/docs but not actually implemented.

### DUPLICATE
Multiple implementations exist for essentially the same functionality.

### UNCERTAIN
Cannot confidently verify without running the application or external service.

For every item, provide:

- Feature name
- Relevant files/routes
- Current implementation
- Status
- Evidence
- Problems
- Recommended fix

---

# 3. TEST THE COMPLETE USER JOURNEY

Audit the project as if you were an actual user.

## Reviewer journey

Test/inspect:

1. Landing page
2. Registration
3. Validation
4. Duplicate account behavior
5. Login
6. Authentication persistence
7. Session expiration
8. Logout
9. Review introduction
10. Starting a review
11. Every step of the review
12. Rating systems
13. Trait selection
14. Written responses
15. Required vs optional questions
16. Back/next navigation
17. Refreshing during the review
18. Browser back button
19. Invalid input
20. Empty input
21. Very long input
22. Special characters
23. Submitting the review
24. Submission errors
25. Successful submission
26. Updating an existing review
27. Review history
28. Logging out
29. Attempting to access protected pages after logout

Determine whether this journey is genuinely production-ready.

---

# 4. AUDIT THE ADMIN EXPERIENCE

Inspect the complete administrator workflow.

Check:

- Admin login
- Admin authentication
- Authorization
- Dashboard
- Review list
- Review details
- Analytics
- Reviewer information
- Review history
- Version history
- Current/latest review logic
- Filters
- Search
- Sorting
- Pagination
- Statistics
- Charts
- Empty states
- Error states
- Loading states
- Data refresh
- Export functionality
- Admin logout
- Unauthorized access
- Direct URL access
- API-level authorization

IMPORTANT:

Do not assume something is secure because the UI hides it.

Check whether protected API endpoints are independently protected.

---

# 5. DATABASE AUDIT

Inspect the complete MongoDB architecture.

Review:

- Collections
- Document structure
- Schemas
- Indexes
- Unique constraints
- Relationships
- References
- Versioning
- Current-review logic
- Transactions
- Atomicity
- Race conditions
- Duplicate records
- Orphaned records
- Null/undefined handling
- Data consistency
- Migration concerns
- Seed scripts
- Database connection handling
- Connection pooling
- Serverless compatibility

Look specifically for situations where:

- Two reviews could accidentally become "current"
- A review update could partially fail
- Duplicate accounts could be created
- A reviewer could modify another review
- Database writes succeed but the UI reports failure
- UI reports success while database writes fail
- Transactions are used unnecessarily or incorrectly
- Queries are inefficient

---

# 6. AUTHENTICATION + SECURITY AUDIT

Perform a serious security review.

Inspect:

- Password hashing
- Password validation
- JWT/session implementation
- Cookie configuration
- HttpOnly
- Secure
- SameSite
- Session expiration
- Token validation
- Token invalidation
- Admin authentication
- Reviewer authentication
- Authorization
- Route protection
- API protection
- Middleware
- CSRF considerations
- XSS risks
- Injection risks
- MongoDB query injection
- Brute-force protection
- Rate limiting
- Account enumeration
- Password reset/security implications
- Sensitive information exposure
- Error-message leakage
- Environment variables
- Secrets
- Logging

Look for any way a malicious reviewer could:

- Access another review
- Modify another review
- Access admin data
- Access admin APIs
- Bypass authentication
- Forge authentication
- Manipulate IDs
- Submit malicious content
- Abuse the review endpoint
- Spam the database

Clearly separate:

**Actual vulnerability**
from
**Theoretical concern**
from
**Recommended hardening**

---

# 7. VALIDATION AUDIT

Inspect every input.

Check whether validation exists both where appropriate on the client and, critically, on the server.

Audit:

- Registration
- Login
- Review fields
- Ratings
- Traits
- Text responses
- IDs
- Query parameters
- Filters
- Pagination
- Admin actions

Look for:

- Missing validation
- Inconsistent validation
- Client-only validation
- Incorrect schemas
- Weak constraints
- Excessive input lengths
- Unexpected values
- Type mismatches
- Missing sanitization

---

# 8. UI/UX AUDIT

Review the entire frontend like a professional product designer.

Check:

### Visual design
- Consistency
- Typography
- Spacing
- Color system
- Hierarchy
- Components
- Buttons
- Inputs
- Cards
- Navigation
- Dashboard
- Mobile layout

### UX
- Is the purpose immediately clear?
- Is the review process intuitive?
- Are questions easy to understand?
- Does the user know how much remains?
- Is progress clear?
- Can users recover from mistakes?
- Are destructive actions clear?
- Are success states clear?
- Are errors understandable?

### Responsive design

Test mentally and through code for:

- Mobile
- Tablet
- Laptop
- Large desktop

Identify layouts that could break.

### Accessibility

Check:

- Keyboard navigation
- Focus states
- Labels
- ARIA where necessary
- Contrast
- Screen-reader usability
- Form errors
- Semantic HTML
- Interactive elements

---

# 9. PERFORMANCE AUDIT

Inspect:

- Database queries
- API calls
- Server rendering
- Client rendering
- Unnecessary re-renders
- Large components
- Bundle size
- Images
- Fonts
- Dynamic imports
- Caching
- Repeated requests
- Dashboard queries
- Analytics calculations

Identify:

### Current performance problems

and

### Future scalability problems

Explain what happens if there are:

- 100 reviewers
- 1,000 reviewers
- 10,000 reviewers
- 100,000 reviews

---

# 10. CODE QUALITY AUDIT

Review the codebase for:

- Duplication
- Overly large files
- Overly large components
- Poor naming
- Tight coupling
- Bad abstractions
- Repeated logic
- Dead code
- Unused imports
- Unused dependencies
- Unused components
- Unused API routes
- Inconsistent patterns
- TypeScript issues
- `any`
- Weak typing
- Poor error handling
- Magic values
- Hardcoded strings
- Difficult-to-maintain logic

Identify files/components that should be:

- Refactored
- Split
- Merged
- Removed
- Reorganized

---

# 11. ERROR HANDLING AUDIT

For every major operation determine:

What happens when it succeeds?

What happens when it fails?

What happens when:

- Database is unavailable?
- Network fails?
- User submits twice?
- Session expires?
- Request times out?
- Invalid data is sent?
- Server throws?
- Component crashes?
- API returns unexpected data?

Check whether users receive useful feedback instead of generic errors.

---

# 12. FIND FEATURES THAT EXIST BUT ARE NOT BEING USED

This is extremely important.

Search the entire codebase for:

- Components that are never imported
- Functions that are never called
- API routes never used by the frontend
- Database fields never displayed
- Schema fields never collected
- Analytics data that is calculated but never shown
- UI controls that don't actually perform anything
- Configuration options that are ignored
- Dependencies that are installed but unused
- Existing functionality hidden from users
- Routes that exist but are unreachable
- Features documented but disconnected from the application

Create a section:

## "Existing but Underutilized"

For each item explain:

- What exists
- Where it exists
- Why it appears underutilized
- How it could be integrated
- Whether integration is actually worthwhile

---

# 13. FIND MISSING FEATURES

Based on what the project is supposed to accomplish, identify features that are missing.

Separate them into:

### Essential
Required for the product to work properly.

### Important
Significantly improves usability, reliability, security, or administration.

### Nice to have
Useful but not necessary.

### Future
Could be added later when the project grows.

Think specifically about a private perception/review archive.

Consider things such as:

- Better reviewer identity/profile
- Review invitation system
- Unique invitation links
- Reviewer anonymity options
- Reviewer relationship/context
- Review completion tracking
- Draft reviews
- Review editing
- Version history UI
- Review comparison
- Advanced analytics
- Trait trends
- Rating trends
- Sentiment analysis
- Recurring review requests
- Exporting reviews
- PDF/CSV export
- Search
- Filtering
- Tags
- Reviewer segmentation
- Timeline/history
- Data backup
- Admin controls
- Moderation
- Abuse prevention
- Duplicate prevention
- Review reminders
- Better onboarding
- Privacy controls

Do NOT automatically recommend every feature.

Evaluate whether each feature actually makes sense for this project.

---

# 14. PRODUCT / CONCEPT AUDIT

Step back from the code.

Ask:

**Does Mirror actually accomplish its intended purpose?**

Evaluate:

- Concept
- User motivation
- Reviewer experience
- Quality of feedback
- Reliability of collected data
- Potential bias
- Review quality
- Long-term usefulness
- Privacy
- Trust
- Incentives
- Whether users will actually complete the review

Identify anything about the product concept itself that should change.

---

# 15. DATA QUALITY AUDIT

Since this project collects personal opinions, audit the quality of the information being collected.

Determine:

- Are questions actually useful?
- Are questions redundant?
- Are ratings meaningful?
- Are written questions good enough?
- Are traits useful?
- Is there enough context behind a rating?
- Can reviews be compared over time?
- Can contradictory feedback be understood?
- Is the data structured enough for future analytics/AI?

Recommend improvements to the review questions if appropriate.

---

# 16. AI / FUTURE ANALYTICS OPPORTUNITIES

Without unnecessarily adding AI, identify where the existing data could eventually support useful intelligence.

Examples:

- Sentiment analysis
- Recurring strengths
- Recurring weaknesses
- Trait trends
- Changes over time
- Common themes
- Contradictions
- Reviewer-group differences
- Personal growth tracking
- "What people consistently appreciate about me"
- "What should I improve?"
- "What changed since the previous review?"

Only recommend these where the underlying data structure supports them.

---

# 17. TESTING AUDIT

Determine what testing currently exists.

Check for:

- Unit tests
- Integration tests
- API tests
- Authentication tests
- Database tests
- End-to-end tests
- Validation tests
- UI tests

Identify the most important missing tests.

Create a recommended test plan.

Prioritize tests based on risk.

---

# 18. DEPLOYMENT / PRODUCTION READINESS

Audit production readiness.

Check:

- Environment variables
- Build
- Type checking
- Linting
- Production configuration
- MongoDB production configuration
- Security
- Error handling
- Logging
- Deployment configuration
- Vercel compatibility
- Serverless behavior
- Database connections
- Production cookies
- Secrets
- Backup/recovery

Determine:

**Can this safely be deployed right now?**

Answer:

- YES
- YES WITH FIXES
- NO

Explain exactly why.

---

# 19. DOCUMENTATION AUDIT

Compare the README/documentation against the actual project.

Find:

- Incorrect documentation
- Missing setup steps
- Missing environment variables
- Missing routes
- Missing features
- Outdated information
- Incorrect commands
- Undocumented behavior

Recommend what the README should contain.

---

# 20. FINAL REPORT

After inspecting everything, produce a structured final report.

Use this exact structure:

# MIRROR — COMPLETE PROJECT AUDIT

## 1. Executive Summary

Give me a concise but honest assessment of the entire project.

Include:

- Overall quality
- Current maturity
- Biggest strengths
- Biggest weaknesses
- Biggest risks
- Biggest opportunities

Give the project an overall score out of 10.

---

## 2. Feature Status

Create a table:

| Feature | Status | Evidence | Problems | Priority |
|---|---|---|---|---|

---

## 3. What's Working Well

List the strongest parts of the project.

---

## 4. What's Broken

List every confirmed broken feature.

Do not include guesses here.

---

## 5. What's Partially Working

Explain incomplete or fragile functionality.

---

## 6. Existing but Unused / Underutilized

List functionality already present but not properly connected or utilized.

---

## 7. Missing Features

Separate into:

### Must Have
### Should Have
### Nice to Have
### Future

---

## 8. Security Findings

For each finding include:

- Severity: Critical / High / Medium / Low
- Problem
- Location
- Impact
- Recommended fix

---

## 9. UX/UI Findings

Rank the problems by severity.

---

## 10. Performance Findings

Explain current and future performance concerns.

---

## 11. Architecture Findings

Explain architectural weaknesses and improvements.

---

## 12. Code Quality Findings

List refactoring opportunities.

---

## 13. Database Findings

Explain schema, indexes, queries, consistency, transactions, and scalability concerns.

---

## 14. Testing Gaps

List the most important missing tests.

---

## 15. Product Improvements

Explain how the actual product/concept could become better.

---

## 16. Recommended New Features

Only recommend features that genuinely make sense.

For every feature explain:

- Why
- User benefit
- Complexity
- Priority

---

# 21. PRIORITY ROADMAP

Create a practical roadmap.

### P0 — Fix Immediately
Critical bugs/security/data-loss issues.

### P1 — Before Production
Important reliability, UX, security, and functionality issues.

### P2 — Next Version
Major improvements.

### P3 — Future
Optional enhancements.

For every task include:

- Task
- Why
- Files likely affected
- Difficulty
- Expected impact

---

# 22. DO NOT MODIFY THE CODE YET

IMPORTANT:

This is an **AUDIT ONLY**.

Do NOT:

- Modify files
- Rewrite code
- Delete files
- Add dependencies
- Change architecture
- Create commits
- Push changes

First give me the complete audit.

I will decide what should actually be implemented afterward.

---

# 23. BE EXTREMELY HONEST

Do not praise the project simply because you are reviewing it.

If something is badly designed, say so.

If something looks impressive but is actually unnecessary, say so.

If a feature exists but provides little value, say so.

If something is documented but doesn't work, explicitly call it out.

If you cannot verify something, say:

**"Unable to verify without running the application."**

Do not invent test results.

Do not assume functionality works because the code looks correct.

---

# 24. IMPORTANT FINAL QUESTION

End the audit with:

## "If this were my project, what would I fix first?"

Give me the **top 10 actions in exact order**.

The goal is not to make Mirror unnecessarily complicated.

The goal is to make it:

**Reliable → Secure → Useful → Polished → Maintainable → Scalable**

Audit the whole repository first and then give me the report.