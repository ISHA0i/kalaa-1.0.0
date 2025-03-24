const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');
const User = require('../models/UserModel');
const { registerUser } = require('../controllers/AuthController');
const { validateUserData } = require('../utils/validation');
// const {AppError,
//   ValidationError,
//   AuthenticationError,
//   AuthorizationError,
//   NotFoundError,
//   DatabaseError}=require('../errors/AppError');
const router = express.Router();

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { message: 'Too many login attempts. Please try again later.' },
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: { message: 'Too many signup attempts. Please try again later.' },
});

// Login Route
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().trim().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Login validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        logger.warn('Login attempt with non-existent user', { email });
        return res.status(404).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn('Invalid password attempt', { email });
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
          algorithm: 'HS256',
        }
      );

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      });

      logger.info('User logged in successfully', { userId: user._id });
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Sign-Up Route
router.post(
  '/signup',
  signupLimiter,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Signup validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      // Additional validation using validateUserData
      const validation = validateUserData(req.body);
      if (!validation.isValid) {
        logger.warn('User data validation failed', {
          errors: validation.errors,
        });
        return res.status(400).json({ errors: validation.errors });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        logger.warn('Signup attempt with existing email', {
          email: req.body.email,
        });
        return res.status(400).json({ message: 'Email already registered' });
      }

      await registerUser(req, res);
    } catch (error) {
      logger.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Logout Route
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User logged out successfully');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

