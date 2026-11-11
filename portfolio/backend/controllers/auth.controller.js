const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { jwtSecret, jwtExpiresIn, isProd, cookieMaxAgeDays, cookieSameSite } = require('../config/env');

const cookieOptions = {
  httpOnly: true, // not readable from JavaScript, so XSS cannot steal the token
  secure: isProd || cookieSameSite === 'none',
  sameSite: cookieSameSite,
  path: '/',
};

// Compared against when the email is unknown so response time does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { algorithm: 'HS256', expiresIn: jwtExpiresIn });
  res.cookie('token', token, { ...cookieOptions, maxAge: cookieMaxAgeDays * 24 * 60 * 60 * 1000 });
  res.json({ success: true, data: user });
});

exports.logout = (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.json({ success: true, message: 'Logged out' });
};

exports.me = (req, res) => res.json({ success: true, data: req.user });
