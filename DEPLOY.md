# Deploy to Render in Under 5 Minutes

This app is a Node/Express + MongoDB API that also serves the built client. It's deployed on **Render** using Docker.

## Prerequisites

- A [Render](https://render.com) account
- A MongoDB connection string (use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier, or Render's private networking to another Mongo host)
- This repo pushed to GitHub/GitLab

## Option A — One-click via Blueprint (fastest)

1. Push this repo to GitHub (with `render.yaml` included).
2. Go to Render Dashboard → **New** → **Blueprint**.
3. Connect your repo. Render reads `render.yaml` automatically.
4. When prompted, set the required env vars:
   - `MONGO_URI` → your Atlas connection string
   - `CLIENT_ORIGIN` → leave blank initially, update after first deploy with your Render URL
5. Click **Apply** — Render builds the Docker image and deploys.

**Commands (if using Render CLI instead of dashboard):**

```bash
# 1. Install Render CLI
brew install render

# 2. Login
render login

# 3. Deploy blueprint from repo root
render blueprint launch
```

## Option B — Manual Web Service Setup

1. Render Dashboard → **New** → **Web Service**.
2. Connect your repo, select branch `main`.
3. Runtime: **Docker**. Root Directory: leave blank (uses repo root `Dockerfile`).
4. Set **Health Check Path**: `/api/health`.
5. Add environment variables under "Environment":
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGO_URI=<your-atlas-uri>`
   - `CLIENT_ORIGIN=<your-render-service-url>`
   - `SESSION_SECRET=<generate-a-random-string>`
6. Click **Create Web Service**. First build takes ~2-4 minutes.

## Enabling Auto-Deploy from GitHub Actions

1. In Render service → **Settings** → **Deploy Hook**, copy the URL.
2. In GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:
   - `RENDER_DEPLOY_HOOK_URL` = the copied URL
3. Every push to `main` now runs tests, builds Docker, then triggers Render deploy.

## Local Testing Before Deploy

```bash
# 1. Copy env file and fill in values
cp .env.example .env

# 2. Build and run with Docker Compose (includes local MongoDB)
docker compose up --build

# 3. Verify health check
curl http://localhost:10000/api/health
```

## Verifying Production Deploy

```bash
curl https://<your-service-name>.onrender.com/api/health
```

You should get a `200 OK` response. If it fails, check Render's **Logs** tab for the service.

## Important Notes

- Ensure `server/index.js` exposes a `GET /api/health` route returning `200` — required for health checks in both Docker and Render.
- If your client uses client-side routing, ensure the server has a catch-all route serving `client/dist/index.html`.
- Update `CLIENT_ORIGIN` after first deploy to match your live Render URL to avoid CORS errors.