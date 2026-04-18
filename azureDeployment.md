# Azure Deployment Guide — Book Notes

## Backend (Express/Node.js)

**Azure App Service** is the simplest fit — deploy your Node.js server directly, no Docker required. It handles:

- Environment variables via Application Settings (maps directly to your `process.env` usage)
- Auto-restart on crash
- Built-in SSL certificates (resolves your HTTPS critical item)
- Deployment from GitHub via built-in CI/CD integration

Alternatively, **Azure Container Apps** if you containerize with Docker — more control, scales to zero.

---

## Database (PostgreSQL)

**Azure Database for PostgreSQL – Flexible Server** is a direct match:

- Fully managed PostgreSQL 14+ (your required version)
- Automated backups built in (checks off that checklist item)
- Private networking to keep DB off the public internet
- Connection string drops straight into your `.env` vars (`DB_HOST`, `DB_USER`, etc.)

---

## Frontend (React/Vite)

Two options:

- Serve `dist/` from the same App Service (simpler, fewer moving parts)
- **Azure Static Web Apps** for the frontend separately — free tier, global CDN, pairs well with App Service backends

---

## What to Watch Out For

- **CORS** — set `FRONTEND_URL` to your actual Azure domain and lock down the CORS config before launch
- **Session cookies** — App Service sits behind a load balancer; make sure `trust proxy` is set in Express so `secure: true` cookies work correctly:
  ```js
  app.set("trust proxy", 1);
  ```
- **Connection pooling** — Azure PostgreSQL has connection limits on lower tiers; worth configuring `pg` pool max explicitly
- **Cold starts** — App Service free/basic tiers can sleep; use at least the B1 paid tier for a real app

---

## Summary

Azure App Service + Azure Database for PostgreSQL Flexible Server is a straightforward, production-ready path for this project with minimal changes to your existing code.

Azure Deployment Roadmap

Phase 1 — Code changes (do this first, in
your local repo)

These are changes to Server.js and config
before touching Azure at all.

1. Fix secure: true on the session cookie —
   currently hardcoded false. Needs to be true
   in production (Azure App Service handles
   HTTPS termination, and trust proxy is already
   set correctly)
2. Add env var validation at startup — crash
   early if SESSION_SECRET or DB_PASSWORD are
   missing instead of using dangerous defaults
3. Install and wire up helmet — one line adds
   all security headers
4. Add rate limiting on /api/users/login and
   /api/users/register
5. Add a dist/ static file serve in Server.js
   so Express serves the React build — this
   lets frontend + backend live on the same App
   Service

---

Phase 2 — Azure resources (set up
infrastructure)

6. Create an Azure account (if you don't have
   one) and install the Azure CLI
7. Provision Azure Database for PostgreSQL –
   Flexible Server — create the DB, run your
   migrations
8. Provision Azure App Service (Node.js 22,
   Linux) — this hosts your Express server

---

Phase 3 — Configuration

9. Set all environment variables in App
   Service → Application Settings
10. Configure the App Service startup command
    to node Server.js

---

Phase 4 — Build & Deploy

11. Build the frontend (npm run build)
    locally or in CI
12. Deploy to App Service — via Azure CLI (az
    webapp up) or GitHub Actions

---

Phase 5 — Verify

13. Run migrations against the Azure
    PostgreSQL instance
14. Smoke test all routes — auth, books,
    library, reviews
