const rateLimit = require('express-rate-limit');

const make = (windowMs, max, message, extra = {}) =>
  rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, message: { success: false, message }, ...extra });

module.exports = {
  loginLimiter: make(15 * 60 * 1000, 10, 'Too many login attempts. Try again in 15 minutes.', { skipSuccessfulRequests: true }),
  contactLimiter: make(60 * 60 * 1000, 5, 'Too many messages sent. Please try again later.'),
};
