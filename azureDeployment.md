# Azure Deployment Guide — Book Notes

## Stack Decision

- **Backend:** Azure App Service (F1 free tier — suitable for portfolio/learning)
- **Database:** Azure Database for PostgreSQL – Flexible Server (B1ms, ~$12-15/mo — no free tier)
- **Frontend:** Served from the same App Service via Express `dist/` static serving
- **Free credit:** New Azure accounts get $200 for 30 days — covers both services during setup

**Cost strategy for portfolio use:** Use free credit to learn and deploy. Stop the PostgreSQL server when not actively demoing to reduce ongoing cost (~$2-3/mo storage only when stopped).

---

## What to Watch Out For

- **CORS** — set `FRONTEND_URL` to your actual Azure domain in App Service Application Settings
- **Session cookies** — App Service sits behind a load balancer. `trust proxy` is already set in `Server.js`:
  ```js
  app.set("trust proxy", 1);
  ```
- **Connection pooling** — Azure PostgreSQL has connection limits on lower tiers; worth configuring `pg` pool max explicitly
- **Cold starts** — F1 tier sleeps after 20 min of inactivity. Fine for portfolio demos, not production.

---

## Deployment Roadmap

### Phase 1 — Code changes ✅ COMPLETE

| #   | Task                                            | Status  |
| --- | ----------------------------------------------- | ------- |
| 1   | Set `secure: true` on session cookie            | ✅ Done |
| 2   | Add env var validation (crash early if missing) | ✅ Done |
| 3   | Install and wire up `helmet`                    | ✅ Done |
| 4   | Add rate limiting on login + register routes    | ✅ Done |
| 5   | Serve `dist/` from Express with catch-all       | ✅ Done |

---

### Phase 2 — Azure resources (current phase)

| #   | Task                                                             | Status  |
| --- | ---------------------------------------------------------------- | ------- |
| 6   | Create Azure account + install Azure CLI                         | ⬜ Todo |
| 7   | Provision Azure Database for PostgreSQL – Flexible Server (B1ms) | ⬜ Todo |
| 8   | Provision Azure App Service (F1, Node.js, Linux)                 | ⬜ Todo |

**CLI commands (Step 6):**

```bash
# Install Azure CLI
brew install azure-cli

# Log in
az login

# Verify
az account show
```

---

### Phase 3 — Configuration

| #   | Task                                                   | Status  |
| --- | ------------------------------------------------------ | ------- |
| 9   | Set all env vars in App Service → Application Settings | ⬜ Todo |
| 10  | Set App Service startup command to `node Server.js`    | ⬜ Todo |

**Required Application Settings:**

```
NODE_ENV=production
SESSION_SECRET=<generated with: openssl rand -base64 32>
DB_HOST=<your-server>.postgres.database.azure.com
DB_NAME=<your-db-name>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_PORT=5432
FRONTEND_URL=https://<your-app>.azurewebsites.net
PORT=8080
```

---

### Phase 4 — Build & Deploy

| #   | Task                                                  | Status  |
| --- | ----------------------------------------------------- | ------- |
| 11  | Build the frontend (`npm run build`)                  | ⬜ Todo |
| 12  | Deploy to App Service via Azure CLI or GitHub Actions | ⬜ Todo |

---

### Phase 5 — Verify

| #   | Task                                                  | Status  |
| --- | ----------------------------------------------------- | ------- |
| 13  | Run migrations against Azure PostgreSQL               | ⬜ Todo |
| 14  | Smoke test all routes — auth, books, library, reviews | ⬜ Todo |
