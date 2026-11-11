const { body } = require('express-validator');
const { field } = require('../middleware/validate');
const { SKILL_CATEGORIES } = require('../models/Skill');
const controller = require('../controllers/skill.controller');
const crudRouter = require('./crudRouter');

module.exports = crudRouter(controller, (create) => [
  field('name', create).trim().isLength({ min: 1, max: 60 }).withMessage('Name must be 1-60 characters'),
  field('category', create).isIn(SKILL_CATEGORIES).withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(', ')}`),
  // Proficiency is never invented: it is only set when the admin provides it (null clears it).
  body('level').optional({ values: 'null' }).isInt({ min: 0, max: 100 }).withMessage('Level must be 0-100').toInt(),
  body('order').optional().isInt({ min: 0, max: 9999 }).toInt(),
]);
