const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: [
    // Console logging with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    // Rotating error log file
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Rotating combined log file
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Ensure log directory exists
const fs = require('fs');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Request logging middleware with performance monitoring
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request body if present
  const requestBody = req.body && Object.keys(req.body).length > 0 
    ? { body: req.body } 
    : {};
  
  // Log query parameters if present
  const queryParams = req.query && Object.keys(req.query).length > 0 
    ? { query: req.query } 
    : {};

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.url}`;
    
    logger.http({
      message,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...requestBody,
      ...queryParams
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn({
        message: `Slow request: ${message}`,
        duration: `${duration}ms`
      });
    }
  });
  
  next();
};

// Error logging middleware with detailed error information
const errorLogger = (err, req, res, next) => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    timestamp: new Date().toISOString()
  };

  // Log error with correlation ID if available
  const correlationId = req.headers['x-correlation-id'] || 'unknown';
  logger.error({
    correlationId,
    ...errorDetails
  });
  
  next(err);
};

// Export logger instance and middleware
module.exports = {
  logger,
  requestLogger,
  errorLogger
}; 