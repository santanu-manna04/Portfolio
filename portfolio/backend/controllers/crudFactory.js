const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const pick = (src, keys) => keys.reduce((o, k) => (src[k] !== undefined ? { ...o, [k]: src[k] } : o), {});

/**
 * Builds list/get/create/update/remove handlers for a Mongoose model.
 * - fields: the ONLY body keys that may be written (file-path fields are never in here).
 * - filterMap: { queryParam: documentField } for optional ?category=... style filters.
 * - beforeDelete(doc): hook to remove uploaded files together with the record.
 */
module.exports = ({ Model, fields, sort, filterMap = {}, beforeDelete }) => {
  const load = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
    return doc;
  };
  return {
    list: asyncHandler(async (req, res) => {
      const filter = {};
      Object.entries(filterMap).forEach(([q, f]) => {
        if (typeof req.query[q] === 'string' && req.query[q]) filter[f] = req.query[q];
      });
      const data = await Model.find(filter).sort(sort).lean();
      res.json({ success: true, count: data.length, data });
    }),
    get: asyncHandler(async (req, res) => res.json({ success: true, data: await load(req.params.id) })),
    create: asyncHandler(async (req, res) => {
      const data = await Model.create(pick(req.body, fields));
      res.status(201).json({ success: true, data });
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await load(req.params.id);
      doc.set(pick(req.body, fields));
      await doc.save();
      res.json({ success: true, data: doc });
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await load(req.params.id);
      if (beforeDelete) await beforeDelete(doc);
      await doc.deleteOne();
      res.json({ success: true, message: `${Model.modelName} deleted` });
    }),
  };
};
