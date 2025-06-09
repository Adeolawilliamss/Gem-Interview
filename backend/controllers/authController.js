const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const accessToken = signAccessToken(user._id);

  // Optional: Set in header (useful for Postman/testing)
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user },
  });
};

exports.logOut = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    sameSite: 'Lax',
    path: '/',
  });
  // Optionally clear refreshToken if set
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    sameSite: 'Lax',
    path: '/',
  });
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

exports.protect = catchAsync(async (req, res, next) => {
  console.log('🔍 Protect Middleware Triggered on:', req.path);

  let token;

  // 1) Prefer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2) Fallback to cookie (optional support for hybrid flows)
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to continue', 401),
    );
  }

  // 3) Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_SECRET,
  );

  // 4) Check user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  // 5) Check password not changed after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  // ✅ Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Send login response first
  createSendToken(newUser, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, req, res);
});