const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 401 when there is no valid session. The token is read only from the HTTP-only cookie.
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, 'Authentication required');
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Account no longer exists');
  req.user = user;
  next();
});

// 403 when the user is signed in but does not have the required role.
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'You do not have permission to do this'));

// Convenience: every admin-only route uses this pair.
const adminOnly = [authenticate, authorize('admin')];

module.exports = { authenticate, authorize, adminOnly };
