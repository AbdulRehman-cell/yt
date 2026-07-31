// Vercel Serverless entry point.
// Wraps the existing Express app (server/index.js) so it runs as a serverless function.
// Requires server/index.js to export the Express `app` instance (see server/index.js below).

const app = require("../server/index.js");

module.exports = app;