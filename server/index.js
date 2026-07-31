require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ---- Config ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const NODE_ENV = process.env.NODE_ENV || "development";

// ---- Middleware ----
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// ---- DB Connection (cached for serverless cold starts) ----
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!MONGO_URI) {
    console.warn("MONGO_URI not set — skipping DB connection.");
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ---- Health check (required for platform + uptime monitors) ----
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: NODE_ENV,
    db: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ---- Example route ----
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Export app for Vercel serverless function usage
module.exports = app;

// Run standalone server only when NOT on Vercel (e.g. local/dev/Docker)
if (require.main === module) {
  connectDB().finally(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} [${NODE_ENV}]`);
    });
  });
}