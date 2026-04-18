# Deployment Checklist — Book Notes

## Critical (must fix before going live)

- [ ] **HTTPS/TLS** — Set up a certificate. Without it, session cookies are sent in plain text
- [ ] **Fix `SESSION_SECRET`** — Change from `"dev-secret"` default. Generate with: `openssl rand -base64 32`
- [ ] **Set `secure: true` on session cookie** — Currently hardcoded `false`. Requires HTTPS
- [ ] **Set `NODE_ENV=production`** — Many libraries behave differently without this
- [ ] **Configure `FRONTEND_URL`** to your production domain (currently defaults to localhost)

---

## Security

- [ ] Install & configure **`helmet`** for security headers (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Add **rate limiting** (`express-rate-limit`) on `/api/users/login` and `/api/users/register`
- [ ] Restrict **CORS** to your production domain only (currently allows all origins)
- [ ] Run `npm audit` and fix high/critical vulnerabilities
- [ ] Remove or guard all `console.log` calls from production
- [ ] Add **account lockout** after repeated failed login attempts

---

## Environment & Config

- [ ] Create a `.env.production` with all required variables set:
  - `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PORT`
  - `SESSION_SECRET`, `PORT`, `FRONTEND_URL`
- [ ] Add **startup validation** that crashes early if required env vars are missing (instead of silently using bad defaults)

---

## Database

- [ ] Run all migrations on the production database
- [ ] Confirm `DB_PASSWORD` is set — it has no fallback and will fail silently
- [ ] Set up **automated backups**
- [ ] Verify indexes exist on `isbn`, `book_title+author`

---

## Frontend Build

- [ ] Run `npm run build` without errors
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all `fetch` calls include `credentials: "include"` (the `Routes/Api.ts` change you have staged fixes one — audit the rest)
- [ ] Remove any dev-only code or debug flags

---

## Deployment Infrastructure (currently nothing exists)

- [ ] Write a **`Dockerfile`** (or configure for your target platform — Railway, Render, Fly.io, etc.)
- [ ] Decide on a **static file serving strategy** — serve `dist/` from Express, or deploy frontend to a CDN separately
- [ ] Fix the missing `dev:all` script referenced in the README
- [ ] Set up a **CI/CD pipeline** (GitHub Actions is the simplest given your existing Git setup)

---

## Observability

- [ ] Add **request logging** middleware (morgan or pino-http)
- [ ] Add **structured error logging** — `console.error` won't survive log aggregation
- [ ] Set up **error tracking** (Sentry free tier works well for this scale)
- [ ] Add a meaningful `/health` endpoint that checks DB connectivity

---

## Nice to Have (post-launch)

- [ ] Input validation library (Zod or Joi) for all API request bodies
- [ ] Graceful shutdown handling (`SIGTERM` → drain connections → exit)
- [ ] Database connection pool tuning
- [ ] Password reset flow
- [ ] Email verification for new accounts

---

**Highest-risk items in priority order:** HTTPS → SESSION_SECRET → helmet → rate limiting → env validation → deployment config.

The data layer is solid (parameterized queries, transactions, constraints). The main gaps are all in infrastructure and security hardening.
