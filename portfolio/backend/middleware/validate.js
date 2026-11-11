const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, 'Validation failed', details));
};

// body(name) that is required on create and optional on update.
const field = (name, create) => (create ? body(name) : body(name).optional());

module.exports = { validate, field };
