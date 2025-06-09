const path = require('path');
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

// Middleware
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, try again in an hour!',
  proxy: true,
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// Serve static files for user uploads if needed
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', userRouter);

// Optional: Serve React production build files if you want backend to serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve React's index.html for any unknown routes (frontend routing)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
