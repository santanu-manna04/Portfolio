const crud = require('./crudFactory');
const Certificate = require('../models/Certificate');
const { removeStored } = require('./upload.controller');

module.exports = crud({
  Model: Certificate,
  fields: ['title', 'organization', 'issueDate', 'credentialId', 'category'],
  sort: { issueDate: -1, createdAt: -1 },
  filterMap: { category: 'category' },
  beforeDelete: async (certificate) => removeStored(certificate.file),
});
