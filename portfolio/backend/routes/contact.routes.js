const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { adminOnly } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiters');
const c = require('../controllers/contact.controller');

const router = express.Router();
const id = [param('id').isMongoId().withMessage('Invalid id'), validate];

router.post(
  '/',
  contactLimiter,
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').isString().trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('subject').isString().trim().isLength({ min: 3, max: 120 }).withMessage('Subject must be 3-120 characters'),
  body('message').isString().trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  validate,
  c.create
);
router.get('/', adminOnly, c.list);
router.patch('/:id/read', adminOnly, id, c.markRead);
router.delete('/:id', adminOnly, id, c.remove);

module.exports = router;
