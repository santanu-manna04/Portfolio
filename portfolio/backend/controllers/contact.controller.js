const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  // Honeypot: the hidden "website" field is empty for humans. Pretend success, store nothing.
  if (req.body.website) return res.status(201).json({ success: true, message: 'Message sent' });
  const { name, email, subject, message } = req.body;
  await Contact.create({ name, email, subject, message, ip: req.ip, userAgent: (req.get('user-agent') || '').slice(0, 300) });
  res.status(201).json({ success: true, message: 'Message sent' });
});

exports.list = asyncHandler(async (req, res) => {
  const data = await Contact.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({ success: true, count: data.length, unread: data.filter((m) => !m.read).length, data });
});

exports.markRead = asyncHandler(async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(req.params.id, { read: req.body.read !== false }, { new: true });
  if (!msg) throw new ApiError(404, 'Message not found');
  res.json({ success: true, data: msg });
});

exports.remove = asyncHandler(async (req, res) => {
  const msg = await Contact.findByIdAndDelete(req.params.id);
  if (!msg) throw new ApiError(404, 'Message not found');
  res.json({ success: true, message: 'Message deleted' });
});
