const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    organization: { type: String, required: true, trim: true, maxlength: 120 },
    issueDate: { type: Date },
    credentialId: { type: String, trim: true, maxlength: 100, default: '' },
    category: { type: String, trim: true, maxlength: 60, default: '' },
    // Written only by the admin-only upload routes.
    file: { type: String, default: '' },
    fileType: { type: String, enum: ['pdf', 'image', ''], default: '' },
  },
  { timestamps: true }
);
certificateSchema.index({ issueDate: -1, createdAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
