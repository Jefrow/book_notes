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
  app.set('trust proxy', 1)
  ```
- **Connection pooling** — Azure PostgreSQL has connection limits on lower tiers; worth configuring `pg` pool max explicitly
- **Cold starts** — App Service free/basic tiers can sleep; use at least the B1 paid tier for a real app

---

## Summary

Azure App Service + Azure Database for PostgreSQL Flexible Server is a straightforward, production-ready path for this project with minimal changes to your existing code.
