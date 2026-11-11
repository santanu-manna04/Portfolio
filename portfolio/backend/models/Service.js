const mongoose = require('mongoose');

const SERVICE_ICONS = ['server', 'network', 'database', 'shield', 'bug', 'layers'];

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    icon: { type: String, enum: SERVICE_ICONS, default: 'server' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
serviceSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model('Service', serviceSchema);
module.exports.SERVICE_ICONS = SERVICE_ICONS;
