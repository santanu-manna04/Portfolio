const path = require('path');

const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

// Single source of truth for upload folders.
const UPLOAD_DIRS = {
  profile: path.join(UPLOAD_ROOT, 'profile'),
  projects: path.join(UPLOAD_ROOT, 'projects'),
  certificates: path.join(UPLOAD_ROOT, 'certificates'),
  resume: path.join(UPLOAD_ROOT, 'resume'),
};

module.exports = { UPLOAD_ROOT, UPLOAD_DIRS };
