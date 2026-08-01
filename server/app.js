// Express app definition, decoupled from server startup (server/index.js).
// This file is imported both by:
//   - server/index.js (for local dev / Docker, calls app.listen)
//   - api/index.js (Vercel serverless handler)
//
// NOTE: If your existing server/index.js already builds the app inline,
// move that logic here and have index.js require this file instead.

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Lazy Mongo connection with connection reuse across serverless invocations.
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = true;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Health check — used by Docker healthcheck and uptime monitors.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

// ---- Mount your existing routes here ----
// Example: app.use('/api/videos', require('./routes/videos'));

// Serve the built React client (Docker deploy). API 404s stay JSON; any
// non-/api/ path falls back to the SPA's index.html.
const path = require('path');
const fs = require('fs');
const distDir = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;