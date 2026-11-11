const { body } = require('express-validator');
const { field } = require('../middleware/validate');
const { SERVICE_ICONS } = require('../models/Service');
const controller = require('../controllers/service.controller');
const crudRouter = require('./crudRouter');

module.exports = crudRouter(controller, (create) => [
  field('title', create).trim().isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),
  field('description', create).trim().isLength({ min: 5, max: 400 }).withMessage('Description must be 5-400 characters'),
  body('icon').optional().isIn(SERVICE_ICONS).withMessage(`Icon must be one of: ${SERVICE_ICONS.join(', ')}`),
  body('order').optional().isInt({ min: 0, max: 9999 }).toInt(),
]);
