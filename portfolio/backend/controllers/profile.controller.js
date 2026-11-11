const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

const PROFILE_FIELDS = ['name', 'title', 'intro', 'location', 'email', 'github', 'linkedin', 'instagram', 'stats'];
const ABOUT_FIELDS = ['bio', 'degree', 'university', 'goal', 'interests', 'strengths', 'hobbies', 'timeline'];
const pick = (src, keys) => Object.fromEntries(keys.filter((k) => src[k] !== undefined).map((k) => [k, src[k]]));

// Returns data: null when no profile exists yet; the frontend then shows its built-in defaults.
exports.get = asyncHandler(async (req, res) => res.json({ success: true, data: await Profile.findOne().lean() }));

exports.getAbout = asyncHandler(async (req, res) => {
  const p = await Profile.findOne().lean();
  res.json({ success: true, data: p?.about || null });
});

exports.update = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate({}, { $set: pick(req.body, PROFILE_FIELDS) }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  res.json({ success: true, data: profile });
});

exports.updateAbout = asyncHandler(async (req, res) => {
  const set = Object.fromEntries(Object.entries(pick(req.body, ABOUT_FIELDS)).map(([k, v]) => [`about.${k}`, v]));
  const profile = await Profile.findOneAndUpdate({}, { $set: set }, { new: true, runValidators: true });
  res.json({ success: true, data: profile?.about || null });
});
