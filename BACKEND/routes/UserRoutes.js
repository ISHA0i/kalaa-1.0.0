const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const authMiddleware = require('../middleware/authMiddleware');
const { logger } = require('../utils/logger');
const { validateUserData } = require('../utils/validation');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();
    
    if (!user) {
      logger.warn('Profile request for non-existent user', { userId: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }
    
    logger.info('Profile retrieved successfully', { userId: req.user.id });
    res.status(200).json(user);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile',
  authMiddleware,
  [
    body('name').optional().trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').optional().isEmail().normalizeEmail()
      .withMessage('Enter a valid email'),
    body('currentPassword').optional().notEmpty()
      .withMessage('Current password is required to update password'),
    body('newPassword').optional()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number and special character')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Profile update validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        logger.warn('Update attempt for non-existent user', { userId: req.user.id });
        return res.status(404).json({ message: 'User not found' });
      }

      // Handle password update
      if (req.body.newPassword) {
        if (!req.body.currentPassword) {
          return res.status(400).json({ message: 'Current password is required' });
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
          logger.warn('Invalid current password in update attempt', { userId: req.user.id });
          return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
      }

      // Update other fields
      if (req.body.name) user.name = req.body.name;
      if (req.body.email && req.body.email !== user.email) {
        // Check if new email already exists
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          logger.warn('Email already in use', { email: req.body.email });
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = req.body.email;
      }

      await user.save();
      logger.info('Profile updated successfully', { userId: user._id });
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete user account
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('Delete attempt for non-existent user', { userId: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.id);
    logger.info('User account deleted successfully', { userId: req.user.id });
    
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;