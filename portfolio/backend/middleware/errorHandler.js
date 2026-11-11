const multer = require('multer');
const { isProd } = require('../config/env');

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Centralized error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.isOperational ? err.message : 'Internal server error';
  let details = err.details;

  if (err instanceof multer.MulterError) {
    status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large.' : `Upload error: ${err.message}`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Duplicate value';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  } else if (status === 404) {
    message = 'File not found';
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    ...(!isProd && status >= 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
