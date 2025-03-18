const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// API specific limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Apply security middleware
const configureSecurityMiddleware = (app) => {
  // Basic security headers
  app.use(helmet());
  
  // Rate limiting
  app.use('/api/', apiLimiter);
  
  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Data sanitization against XSS
  app.use(xss());
  
  // Enable CSRF protection
  app.use(csrf({ cookie: true }));
  
  // Compression
  app.use(compression());
  
  // Error handler for CSRF token errors
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token'
    });
  });
};

module.exports = {
  configureSecurityMiddleware,
  limiter,
  apiLimiter
}; 