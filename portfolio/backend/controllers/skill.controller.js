const crud = require('./crudFactory');
const Skill = require('../models/Skill');

module.exports = crud({
  Model: Skill,
  fields: ['name', 'category', 'level', 'order'],
  sort: { category: 1, order: 1, name: 1 },
  filterMap: { category: 'category' },
});
