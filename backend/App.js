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

// 1) CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://gem-interview.onrender.com',
];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed from this origin'));
      }
    },
    credentials: true,
    exposedHeaders: ['Content-Type'],
  })
);

// 2) Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// 4) Rate limiter on /api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10000,
  message: 'Too many requests from this IP, try again later',
});
app.use('/api', limiter);

// 5) Body parsers, cookies, compression
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// 6) Request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 7) API routes
app.use('/api/users', userRouter);
app.get('/api', (req, res) => {
  res.status(200).send('Server is live and healthy');
});

// 8) Serve React build from frontend folder
const clientBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(clientBuildPath));

// 9) Catch-all for client-side routing — skip /api
app.get('/*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// 10) Global error handler
app.use(globalErrorHandler);

module.exports = app;
