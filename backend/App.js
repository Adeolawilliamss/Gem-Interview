const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();
app.enable('trust proxy');

// ✅ CORS Setup – Simple for same-domain deployment
app.use(cors({
  origin: true,           // Reflect origin (safe in same-origin setup)
  credentials: true       // Needed for cookies / auth
}));

// ✅ Serve static frontend build
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}));

// ✅ Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, try again in an hour!'
});
app.use('/api', limiter);

// ✅ Body parsing and compression
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// ✅ Add request time to all requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ✅ API routes
app.use('/api/users', userRouter);

// ✅ Health check
app.get('/api', (req, res) => {
  res.status(200).send('Server is live and healthy');
});

// ✅ React SPA fallback (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Global error handler
app.use(globalErrorHandler);

module.exports = app;
