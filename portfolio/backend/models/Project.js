const mongoose = require('mongoose');

const PROJECT_CATEGORIES = ['Backend', 'Full Stack', 'JavaScript', 'React'];

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    technologies: [{ type: String, trim: true, maxlength: 50 }],
    features: [{ type: String, trim: true, maxlength: 200 }],
    categories: [{ type: String, enum: PROJECT_CATEGORIES }],
    githubUrl: { type: String, trim: true, default: '' },
    liveUrl: { type: String, trim: true, default: '' },
    // File fields are written only by the admin-only upload routes, never from JSON bodies.
    thumbnail: { type: String, default: '' },
    screenshots: [{ type: String }],
    documentation: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
projectSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
module.exports.PROJECT_CATEGORIES = PROJECT_CATEGORIES;
