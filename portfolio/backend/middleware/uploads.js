const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { UPLOAD_DIRS } = require('../config/paths');
const ApiError = require('../utils/ApiError');

const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

const createUploader = (folder, maxFileSize) => multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIRS[folder],
    filename: (req, file, done) => done(null, `${crypto.randomUUID()}${extensions[file.mimetype] || ''}`),
  }),
  limits: { fileSize: maxFileSize, files: 10 },
  fileFilter: (req, file, done) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!extensions[file.mimetype] || extensions[file.mimetype] !== extension) {
      return done(new ApiError(400, 'Use a JPEG, PNG, or WebP image, or a PDF certificate.'));
    }
    done(null, true);
  },
});

module.exports = {
  projectUpload: createUploader('projects', 8 * 1024 * 1024),
  certificateUpload: createUploader('certificates', 10 * 1024 * 1024),
};
