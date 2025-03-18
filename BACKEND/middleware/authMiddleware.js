// filepath: d:\git clone\kalaa-1.0.0\BACKEND\middleware\authMiddleware.js
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const User = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      logger.warn('No authentication token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id)
        .select('-password')
        .lean();

      if (!user) {
        logger.warn('User not found with token', { userId: decoded.id });
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        logger.warn('Inactive user attempted access', { userId: user._id });
        return res.status(403).json({ message: 'Account is inactive' });
      }

      // Add user info to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Expired token used');
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        logger.warn('Invalid token used');
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorization attempted without authentication');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user._id,
        requiredRoles: roles,
        userRole: req.user.role
      });
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};