const crud = require('./crudFactory');
const Service = require('../models/Service');

module.exports = crud({ Model: Service, fields: ['title', 'description', 'icon', 'order'], sort: { order: 1, createdAt: 1 } });
