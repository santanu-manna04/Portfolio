const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiters');
const c = require('../controllers/auth.controller');

const router = express.Router();
// There is intentionally no public register endpoint. Create the admin with `npm run create-admin`.
router.post(
  '/login',
  loginLimiter,
  body('email').isString().trim().toLowerCase().isEmail().withMessage('Enter a valid email'),
  body('password').isString().isLength({ min: 1, max: 200 }).withMessage('Enter your password'),
  validate,
  c.login
);
router.post('/logout', c.logout);
router.get('/me', authenticate, c.me);

module.exports = router;
