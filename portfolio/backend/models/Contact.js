const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: true }
);
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
