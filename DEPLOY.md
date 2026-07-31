# Deploy Guide (Vercel) — under 5 minutes

This project deploys as:
- **Frontend** (`client/`) → static build served by Vercel
- **Backend** (`server/`) → Vercel Serverless Function via `api/index.js`

## Prerequisites
- Node.js >= 18 installed locally
- A [Vercel](https://vercel.com) account
- A MongoDB connection string (free tier: [MongoDB Atlas](https://www.mongodb.com/atlas))

## 1. Install the Vercel CLI
```bash
npm install -g vercel@37.4.0
```

## 2. Login and link the project
```bash
vercel login
vercel link
```
Follow the prompts (accept defaults). This creates a `.vercel` folder locally.

## 3. Set environment variables
```bash
vercel env add MONGO_URI production
vercel env add CLIENT_ORIGIN production
```
Paste your MongoDB Atlas URI and your production frontend URL (e.g. `https://your-app.vercel.app`) when prompted.

## 4. Deploy
```bash
vercel --prod
```

That's it — Vercel will run `npm run vercel-build`, output the client build to `client/dist`, and deploy `api/index.js` as a serverless function. Your API will be available at `/api/*` and health check at `/api/health`.

## Optional: Automated CI/CD (GitHub Actions)
1. Get these values:
   - `vercel whoami` → confirms login
   - Run `vercel link` once, then check `.vercel/project.json` for `orgId` and `projectId`
   - Create a token at https://vercel.com/account/tokens
2. Add these as GitHub repo secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to `main` — GitHub Actions will build, test, and deploy automatically.

## Local development (optional, via Docker)
```bash
docker compose up --build
```
Server available at `http://localhost:5000/api/health`.

## Troubleshooting
- **DB not connecting**: verify `MONGO_URI` is set in Vercel → Project → Settings → Environment Variables, and that your Atlas cluster allows access from `0.0.0.0/0` (or Vercel's IP ranges).
- **CORS errors**: ensure `CLIENT_ORIGIN` matches your deployed frontend URL exactly (no trailing slash).
- **404 on API routes**: confirm `vercel.json` rewrites are present and `api/index.js` exists.