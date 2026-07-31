# Deploy Guide (under 5 minutes)

This app deploys to **Vercel** (client + API as serverless functions).
MongoDB runs on **MongoDB Atlas** (free tier) since Vercel has no persistent storage.

## Prerequisites
- Node.js 18+ installed
- A [Vercel](https://vercel.com) account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (free tier is fine)

## 1. Get your MongoDB connection string
1. Create a free cluster on Atlas.
2. Add a database user + password.
3. Network Access → Allow access from anywhere (`0.0.0.0/0`).
4. Copy the connection string, e.g.:
   `mongodb+srv://user:pass@cluster0.mongodb.net/yt?retryWrites=true&w=majority`

## 2. Configure environment variables locally
```bash
cp .env.example .env
# edit .env and set MONGODB_URI to your Atlas string
```

## 3. Install the Vercel CLI and deploy
```bash
npm install -g vercel@34.3.0
vercel login
```

## 4. Link and deploy (3 commands)
```bash
vercel link
vercel env add MONGODB_URI production   # paste your Atlas URI when prompted
vercel --prod
```

That's it — Vercel builds the client (`npm run build`) and deploys `api/index.js`
as a serverless function, routed via `vercel.json`.

## 5. (Optional) Enable auto-deploy from GitHub Actions
1. In your Vercel project settings, grab: **Project ID**, **Org ID**, and create a **Vercel Token** (Account Settings → Tokens).
2. Add them as GitHub repo secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds, tests, and deploys automatically.

## Verify it worked
```bash
curl https://<your-app>.vercel.app/api/health
# Expect: {"status":"ok","db":"connected",...}
```

## Local development with Docker (alternative, non-Vercel)
```bash
docker compose up --build
curl http://localhost:5000/api/health