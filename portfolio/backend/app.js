const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { clientUrl, isProd } = require('./config/env');
const { UPLOAD_ROOT } = require('./config/paths');
const sanitize = require('./middleware/sanitize');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: clientUrl, credentials: true }));
if (!isProd) app.use(morgan('dev'));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(sanitize);

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

// Public READ-ONLY access to uploaded files (GET/HEAD only). No upload route is public.
app.use(
  '/uploads',
  express.static(UPLOAD_ROOT, { index: false, dotfiles: 'deny', fallthrough: false, maxAge: '7d' })
);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
