const mongoose = require('mongoose');

const stat = new mongoose.Schema({ label: { type: String, required: true, trim: true, maxlength: 60 }, value: { type: Number, required: true, min: 0 } }, { _id: false });
const step = new mongoose.Schema({ title: { type: String, required: true, trim: true, maxlength: 100 }, text: { type: String, required: true, trim: true, maxlength: 400 } }, { _id: false });
const list = [{ type: String, trim: true, maxlength: 160 }];

// Singleton document: the app only ever reads/updates the first Profile.
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    title: { type: String, trim: true, maxlength: 160, default: '' },
    intro: { type: String, trim: true, maxlength: 600, default: '' },
    location: { type: String, trim: true, maxlength: 80, default: 'India' },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    github: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    stats: [stat],
    about: {
      bio: { type: String, trim: true, maxlength: 1200, default: '' },
      degree: { type: String, trim: true, maxlength: 160, default: '' },
      university: { type: String, trim: true, maxlength: 160, default: '' },
      goal: { type: String, trim: true, maxlength: 160, default: '' },
      interests: list,
      strengths: list,
      hobbies: list,
      timeline: [step],
    },
    // Written only by admin-only upload routes when implemented.
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
