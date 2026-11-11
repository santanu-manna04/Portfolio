const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

router.use('/auth', require('./auth.routes'));
router.use('/projects', require('./project.routes'));
router.use('/certificates', require('./certificate.routes'));
router.use('/skills', require('./skill.routes'));
router.use('/services', require('./service.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/uploads', require('./upload.routes'));

module.exports = router;
