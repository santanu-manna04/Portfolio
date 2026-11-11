const crud = require('./crudFactory');
const Project = require('../models/Project');
const { removeStored } = require('./upload.controller');

module.exports = crud({
  Model: Project,
  fields: ['title', 'description', 'technologies', 'features', 'categories', 'githubUrl', 'liveUrl', 'order'],
  sort: { order: 1, createdAt: -1 },
  filterMap: { category: 'categories' },
  beforeDelete: async (project) => {
    await Promise.all([project.thumbnail, ...project.screenshots].map(removeStored));
  },
});
