# Deployment Checklist — Book Notes

## Critical (must fix before going live)

- [x] **Set `secure: true` on session cookie** — Fixed, requires HTTPS
- [x] **Add startup validation** — Crashes early if `SESSION_SECRET` or `DB_PASSWORD` are missing
- [ ] **HTTPS/TLS** — Handled by Azure App Service (built-in SSL on `*.azurewebsites.net`)
- [ ] **Fix `SESSION_SECRET`** — Will be set as an Azure App Service Application Setting (never commit to repo). Generate with: `openssl rand -base64 32`
- [ ] **Set `NODE_ENV=production`** — Will be set in Azure App Service Application Settings
- [ ] **Configure `FRONTEND_URL`** — Will be set to Azure domain in App Service Application Settings

---

## Security

- [x] Install & configure **`helmet`** — Wired up before all other middleware
- [x] Add **rate limiting** (`express-rate-limit`) — Applied to `/api/users/login` and `/api/users/register` (10 req / 15 min)
- [ ] Restrict **CORS** to your production domain only — Set `FRONTEND_URL` to Azure domain when provisioned
- [ ] Run `npm audit` and fix high/critical vulnerabilities
- [ ] Remove or guard all `console.log` calls from production
- [ ] Add **account lockout** after repeated failed login attempts

---

## Environment & Config

- [x] **Startup validation** — Crashes early if `SESSION_SECRET` or `DB_PASSWORD` are missing
- [ ] Set all required variables in **Azure App Service → Application Settings**:
  - `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PORT`
  - `SESSION_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV`

---

## Database

- [ ] Provision **Azure Database for PostgreSQL – Flexible Server** (B1ms tier)
- [ ] Run all migrations on the production database
- [ ] Automated backups — built into Azure PostgreSQL Flexible Server
- [ ] Verify indexes exist on `isbn`, `book_title+author`

---

## Frontend Build

- [x] **Express serves `dist/`** — `express.static` + `app.get("*")` catch-all added to `Server.js`
- [ ] Run `npm run build` without errors
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all `fetch` calls include `credentials: "include"`
- [ ] Remove any dev-only code or debug flags

---

## Deployment Infrastructure

- [x] **Static file serving** — `dist/` served from Express, frontend + backend on same App Service
- [ ] Provision **Azure App Service** (F1 free tier, Node.js, Linux)
- [ ] Set App Service startup command to `node Server.js`
- [ ] Fix the missing `dev:all` script referenced in the README
- [ ] Set up a **CI/CD pipeline** (GitHub Actions)

---

## Observability

- [ ] Add **request logging** middleware (morgan or pino-http)
- [ ] Add **structured error logging** — `console.error` won't survive log aggregation
- [ ] Set up **error tracking** (Sentry free tier works well for this scale)
- [ ] Improve `/health` endpoint to check DB connectivity

---

## Nice to Have (post-launch)

- [ ] Input validation library (Zod or Joi) for all API request bodies
- [ ] Graceful shutdown handling (`SIGTERM` → drain connections → exit)
- [ ] Database connection pool tuning
- [ ] Password reset flow
- [ ] Email verification for new accounts

---

**Progress: Phase 1 complete. Currently on Phase 2 — Azure resource provisioning.**
