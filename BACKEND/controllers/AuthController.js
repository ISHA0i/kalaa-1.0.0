const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
const User = require('../models/UserModel');
const { logger } = require('../utils/logger');
const { ValidationError, AuthenticationError } = require('../errors/AppError');
const { catchAsync } = require('../errors/servererror');
const nodemailer = require('nodemailer');

exports.registerUser = catchAsync(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    const error = new ValidationError('Registration validation failed');
    if (!name) error.addError('name', 'Name is required');
    if (!email) error.addError('email', 'Email is required');
    if (!password) error.addError('password', 'Password is required');
    if (error.validationErrors.length > 0) throw error;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    logger.info('User registered successfully', { userId: user._id });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const error = new ValidationError('Login validation failed');
  if (!email) error.addError('email', 'Email is required');
  if (!password) error.addError('password', 'Password is required');
  if (error.validationErrors.length > 0) throw error;

  // Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from output
  user.password = undefined;

  logger.info('User logged in', { userId: user._id, email });

  // Send token as cookie
  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
    status: 'success',
    token,
    data: { user }
  });
});

exports.logoutUser = catchAsync(async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  logger.info('User logged out', { userId: req.user?._id });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError('No user found with this email');
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    text: `Your password reset token is: ${resetToken}`
  };

  await transporter.sendMail(mailOptions);

  logger.info('Password reset requested', { userId: user._id, email });

  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email'
  });
});