const fs = require('fs');
const { UPLOAD_DIRS } = require('../config/paths');

module.exports = function ensureUploadDirs() {
  Object.values(UPLOAD_DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
};
