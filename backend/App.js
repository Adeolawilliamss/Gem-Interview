const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();
app.enable('trust proxy');

// Security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, try again in an hour!',
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// Public folder for static assets (uploads, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRouter);

// === Serve React build only if it exists ===
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  const indexPath = path.join(buildPath, 'index.html');

  // Check if build exists to avoid crashing
  if (fs.existsSync(indexPath)) {
    app.use(express.static(buildPath));

    // Handle non-API frontend routes
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    console.warn('⚠️ React build not found. Skipping static serving.');
  }
}

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
