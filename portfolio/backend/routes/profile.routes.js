const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { adminOnly } = require('../middleware/auth');
const c = require('../controllers/profile.controller');

const router = express.Router();
const url = (n) => body(n).optional({ values: 'falsy' }).trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage(`${n} must be a valid http(s) URL`);
const strList = (n) => [body(n).optional().isArray({ max: 20 }), body(`${n}.*`).isString().trim().isLength({ min: 1, max: 160 })];

router.get('/', c.get);
router.get('/about', c.getAbout);

router.put(
  '/',
  adminOnly,
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('title').optional().trim().isLength({ max: 160 }),
  body('intro').optional().trim().isLength({ max: 600 }),
  body('location').optional().trim().isLength({ max: 80 }),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Enter a valid email'),
  url('github'), url('linkedin'), url('instagram'),
  body('stats').optional().isArray({ max: 8 }),
  body('stats.*.label').isString().trim().isLength({ min: 1, max: 60 }),
  body('stats.*.value').isFloat({ min: 0, max: 1000000 }).toFloat(),
  validate,
  c.update
);

router.put(
  '/about',
  adminOnly,
  body('bio').optional().trim().isLength({ max: 1200 }),
  body('degree').optional().trim().isLength({ max: 160 }),
  body('university').optional().trim().isLength({ max: 160 }),
  body('goal').optional().trim().isLength({ max: 160 }),
  ...strList('interests'), ...strList('strengths'), ...strList('hobbies'),
  body('timeline').optional().isArray({ max: 20 }),
  body('timeline.*.title').isString().trim().isLength({ min: 1, max: 100 }),
  body('timeline.*.text').isString().trim().isLength({ min: 1, max: 400 }),
  validate,
  c.updateAbout
);

// Resume and profile-image upload routes are not implemented yet.
module.exports = router;
