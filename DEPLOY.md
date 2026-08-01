# Deploy Guide — 5 Minutes to Production

This project deploys as a single Docker web service on **Render**, backed by **MongoDB Atlas** (free tier works).

## Prerequisites
- A [Render](https://render.com) account (free)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (free) — or any reachable MongoDB URI
- This repo pushed to GitHub

## Step 1 — Get a MongoDB connection string

1. Create a free Atlas cluster.
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, allow access from `0.0.0.0/0` (or Render's IPs).
4. Copy the connection string, e.g.:
   ```
   mongodb+srv://youruser:yourpass@cluster0.mongodb.net/yt?retryWrites=true&w=majority
   ```

## Step 2 — Deploy to Render

**Option A: One-click via Blueprint (recommended)**

```bash
# 1. Push your repo to GitHub if not already done
git add . && git commit -m "Add deployment config" && git push origin main
```

Then in the Render dashboard:
1. Click **New +** → **Blueprint**.
2. Connect your GitHub repo. Render auto-detects `render.yaml`.
3. When prompted, set environment variables:
   - `MONGO_URI` → your Atlas connection string
   - `CORS_ORIGIN` → your Render service URL (you'll get this after first deploy, e.g. `https://yt-app.onrender.com`)
4. Click **Apply** — Render builds the Docker image and deploys automatically.

**Option B: CLI-free manual dashboard setup**

```bash
# 2. Just push — Render auto-deploys on every push to main once connected
git push origin main
```

## Step 3 — Set up auto-deploy from GitHub Actions (optional but included)

1. In Render, go to your service → **Settings** → **Deploy Hook** → copy the URL.
2. In GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: (the URL you copied)

```bash
# 3. Now every push to main triggers: lint/test -> docker build -> Render deploy
git push origin main
```

## Verify it worked

```bash
curl https://<your-service>.onrender.com/api/health
# Expect: {"status":"ok"}
```

> **Note:** `server/index.js` must expose a `GET /api/health` route returning HTTP 200 for the health checks in `Dockerfile`, `docker-compose.yml`, and `render.yaml` to pass. Add it if missing:
> ```js
> app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
> ```

## Local development with Docker

```bash
cp .env.example .env
# edit .env if needed, then:
docker compose up --build
```

Visit `http://localhost:3000`.

## Rollback

In Render dashboard → your service → **Events** tab → pick a previous successful deploy → **Redeploy**.