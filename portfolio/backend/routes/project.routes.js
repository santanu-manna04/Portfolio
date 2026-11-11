const { body } = require('express-validator');
const { field } = require('../middleware/validate');
const { PROJECT_CATEGORIES } = require('../models/Project');
const controller = require('../controllers/project.controller');
const crudRouter = require('./crudRouter');

const url = (n) => body(n).optional({ values: 'falsy' }).trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage(`${n} must be a valid http(s) URL`);

module.exports = crudRouter(controller, (create) => [
  field('title', create).trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2-120 characters'),
  field('description', create).trim().isLength({ min: 5, max: 600 }).withMessage('Description must be 5-600 characters'),
  body('technologies').optional().isArray({ max: 30 }),
  body('technologies.*').isString().trim().isLength({ min: 1, max: 50 }),
  body('features').optional().isArray({ max: 20 }),
  body('features.*').isString().trim().isLength({ min: 1, max: 200 }),
  body('categories').optional().isArray({ max: 4 }),
  body('categories.*').isIn(PROJECT_CATEGORIES).withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(', ')}`),
  url('githubUrl'),
  url('liveUrl'),
  body('order').optional().isInt({ min: 0, max: 9999 }).toInt(),
]);
