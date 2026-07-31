# Deploy Guide — Render (under 5 minutes)

This app is a Node.js/Express API (`server/`) serving a built client (`client/`), using MongoDB via Mongoose. It deploys to **Render** using the included Dockerfile.

## Prerequisites
- A [Render account](https://dashboard.render.com) (free to sign up)
- This repo pushed to GitHub/GitLab
- `git` installed locally

## Option A — One-click via render.yaml (recommended)

1. Push your code:
   ```bash
   git add .
   git commit -m "Add production deployment config"
   git push origin main
   ```

2. In the Render Dashboard: **New > Blueprint**, select this repository. Render will read `render.yaml` and provision:
   - `yt-app` (Docker web service, health check on `/api/health`)
   - `yt-mongo` (managed MongoDB database)

3. Set the two required secret env vars when prompted (or after, under **Environment**):
   - `MONGO_URI` → copy the internal connection string from the `yt-mongo` database page
   - `CLIENT_ORIGIN` → your Render app URL, e.g. `https://yt-app.onrender.com`

That's it — Render builds the Docker image and deploys. Visit the assigned `.onrender.com` URL.

## Option B — Manual service creation (no Blueprint)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Create the service (via dashboard): New > Web Service
#    - Runtime: Docker
#    - Dockerfile path: ./Dockerfile
#    - Health check path: /api/health

# 3. Add env vars in the Render dashboard (Environment tab):
#    NODE_ENV=production
#    MONGO_URI=<your MongoDB Atlas or Render DB URI>
#    JWT_SECRET=<openssl rand -hex 32>
#    CLIENT_ORIGIN=https://<your-service>.onrender.com
```

Click **Create Web Service** — done.

## Enable auto-deploy from GitHub Actions (optional)

1. In Render: service **Settings > Deploy Hook** → copy the URL.
2. In GitHub: repo **Settings > Secrets and variables > Actions** → add secret `RENDER_DEPLOY_HOOK_URL` with that value.
3. Every push to `main` now runs tests, builds, then triggers a Render deploy automatically.

## Verify the deployment

```bash
curl https://<your-service>.onrender.com/api/health
# Expect: {"status":"ok"} (200)
```

## Local test before deploying

```bash
docker compose up --build
curl http://localhost:10000/api/health
```

## Required env vars

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Random secret for auth tokens |
| `CLIENT_ORIGIN` | yes | Allowed CORS origin (your live URL) |
| `PORT` | no | Defaults to 10000 on Render |
| `VITE_API_BASE_URL` | no | Client build-time API URL |

## Troubleshooting
- **Build fails on client:** ensure `client/package.json` has a `build` script outputting to `client/dist`.
- **Health check failing:** confirm `server/index.js` exposes `GET /api/health` returning HTTP 200.
- **DB connection errors:** double check `MONGO_URI` matches the Render internal connection string format (`mongodb://user:pass@host:port/db`).