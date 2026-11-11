const express = require('express');
const { param } = require('express-validator');
const { adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Public: GET. Admin only (401/403 enforced on the server): POST, PUT, DELETE.
module.exports = (c, rules) => {
  const router = express.Router();
  const id = [param('id').isMongoId().withMessage('Invalid id'), validate];
  router.get('/', c.list);
  router.get('/:id', id, c.get);
  router.post('/', adminOnly, rules(true), validate, c.create);
  router.put('/:id', adminOnly, id, rules(false), validate, c.update);
  router.delete('/:id', adminOnly, id, c.remove);
  return router;
};
