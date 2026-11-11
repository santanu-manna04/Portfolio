const { port } = require('./config/env');
const connectDB = require('./config/db');
const ensureUploadDirs = require('./utils/ensureUploadDirs');
const mongoose = require('mongoose');
const app = require('./app');

(async () => {
  try {
    ensureUploadDirs();
    await connectDB();
    const server = app.listen(port, () => console.log(`API running on http://localhost:${port}`));

    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };
    ['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
