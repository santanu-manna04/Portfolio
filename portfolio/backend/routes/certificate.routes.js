const { body } = require('express-validator');
const { field } = require('../middleware/validate');
const controller = require('../controllers/certificate.controller');
const crudRouter = require('./crudRouter');

// Certificate file uploads use the separate admin-only multipart routes.
module.exports = crudRouter(controller, (create) => [
  field('title', create).trim().isLength({ min: 2, max: 160 }).withMessage('Title must be 2-160 characters'),
  field('organization', create).trim().isLength({ min: 2, max: 120 }).withMessage('Organization must be 2-120 characters'),
  body('issueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Issue date must be a valid date'),
  body('credentialId').optional().trim().isLength({ max: 100 }),
  body('category').optional().trim().isLength({ max: 60 }),
]);
