# Deploy Guide (Under 5 Minutes)

This app is an Express server (with a MongoDB backend) that serves a built client. It deploys to **Render** in a few clicks.

## Prerequisites

- A [Render](https://render.com) account (free)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) free cluster (or any MongoDB URI)
- This repo pushed to GitHub

## 1. Get a MongoDB connection string

1. Create a free cluster on MongoDB Atlas.
2. Create a database user (username + password).
3. Network Access → allow `0.0.0.0/0` (or Render's IPs).
4. Copy the connection string, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/yt?retryWrites=true&w=majority
   ```

## 2. Deploy to Render (Dashboard method — fastest)

1. Go to [render.com/dashboard](https://dashboard.render.com) → **New → Blueprint**.
2. Connect your GitHub repo. Render will detect `render.yaml` automatically.
3. When prompted, set the environment variables:
   - `MONGO_URI` → your Atlas connection string
   - `CLIENT_ORIGIN` → your Render URL, e.g. `https://yt-app.onrender.com` (you can update this after first deploy)
4. Click **Apply**. Render will build and deploy automatically.

Your app will be live at `https://yt-app.onrender.com` (or similar) in a few minutes.

## 3. Deploy via CLI (alternative)

```bash
# 1. Install Render CLI
brew install render-oss/render/render   # or see https://render.com/docs/cli

# 2. Log in
render login

# 3. Deploy using the blueprint in this repo
render blueprint launch
```

## 4. Enable auto-deploy on push (CI/CD)

1. In Render Dashboard → your service → **Settings → Deploy Hook**, copy the deploy hook URL.
2. In GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: (the URL you copied)
3. Every push to `main` will now run tests and trigger a Render deploy automatically via `.github/workflows/deploy.yml`.

## 5. Verify it's working

```bash
curl https://yt-app.onrender.com/health
# Expect: {"status":"ok"}
```

> **Note:** Your `server/index.js` must expose a `GET /health` route returning HTTP 200 (e.g. `res.json({ status: 'ok' })`) for Render health checks and Docker `HEALTHCHECK` to pass.

## Local development (optional)

```bash
# 1. Copy env template
cp .env.example .env

# 2. Start Mongo + app with Docker Compose
docker compose up --build

# App available at http://localhost:10000
```

---

### Troubleshooting

| Problem | Fix |
|---|---|
| Health check failing | Ensure `/health` route exists and returns 200 |
| CORS errors in browser | Set `CLIENT_ORIGIN` to your exact deployed frontend URL |
| Mongo connection refused | Double-check `MONGO_URI`, Atlas IP allowlist, and credentials |
| Build fails on client | Confirm `client/package.json` has a `build` script outputting to `client/dist` |