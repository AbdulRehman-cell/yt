// Vercel serverless entry point.
// Wraps the existing Express app (server/) so it runs as a single
// serverless function. All /api/* traffic is routed here by vercel.json.

const app = require('../server/app');

// Vercel expects a (req, res) handler, not app.listen().
// server/app.js must export the configured Express app WITHOUT calling .listen().
module.exports = (req, res) => app(req, res);