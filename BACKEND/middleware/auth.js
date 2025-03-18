const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const User = require('../models/UserModel');

// Verify JWT token
const verifyToken = async (req, res, next) => {
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

// Verify admin role
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      logger.warn('Admin verification attempted without authentication');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
      logger.warn('Non-admin access attempt', { 
        userId: req.user._id,
        userRole: req.user.role 
      });
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    logger.error('Admin verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Rate limiting middleware
const rateLimit = (limit, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    requests.forEach((timestamp, key) => {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    });

    // Get requests in window
    const requestCount = (requests.get(ip) || [])
      .filter(timestamp => timestamp > windowStart)
      .length;

    if (requestCount >= limit) {
      logger.warn('Rate limit exceeded', { ip, requestCount });
      return res.status(429).json({ 
        message: 'Too many requests, please try again later' 
      });
    }

    // Add current request
    const userRequests = requests.get(ip) || [];
    userRequests.push(now);
    requests.set(ip, userRequests);

    next();
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  rateLimit
}; 