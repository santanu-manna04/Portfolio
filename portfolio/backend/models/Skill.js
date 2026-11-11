const mongoose = require('mongoose');

const SKILL_CATEGORIES = ['Programming Languages', 'Backend Development', 'Database', 'Tools', 'Frontend'];

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, enum: SKILL_CATEGORIES },
    // Optional, admin-configured. null means "not set" and no progress bar is shown.
    level: { type: Number, min: 0, max: 100, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
module.exports.SKILL_CATEGORIES = SKILL_CATEGORIES;
