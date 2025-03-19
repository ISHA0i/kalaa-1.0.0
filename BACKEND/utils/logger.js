// filepath: d:\git clone\kalaa-1.0.0\BACKEND\utils\logger.js

const logger = {
  info: (message, meta) => {
    console.log(`INFO: ${message}`, meta || '');
  },
  warn: (message, meta) => {
    console.warn(`WARN: ${message}`, meta || '');
  },
  error: (message, meta) => {
    console.error(`ERROR: ${message}`, meta || '');
  },
  debug: (message, meta) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`DEBUG: ${message}`, meta || '');
    }
  }
};

module.exports = { logger };