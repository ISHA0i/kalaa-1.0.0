const { logger } = require('./logger');

class CacheService {
  constructor() {
    this._store = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0
    };
    logger.info('In-memory cache initialized');
  }

  // Generate cache key
  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }

  // Cache middleware with options
  cache(options = {}) {
    const {
      duration = 3600, // Default 1 hour
      prefix = '__express__',
      useQueryParams = true,
      keyGenerator = null
    } = options;

    return (req, res, next) => {
      try {
        // Generate cache key
        let key;
        if (keyGenerator) {
          key = keyGenerator(req);
        } else {
          const identifier = useQueryParams 
            ? `${req.originalUrl}:${JSON.stringify(req.query)}`
            : req.originalUrl;
          key = this.generateKey(prefix, identifier);
        }

        // Try to get cached response
        const cached = this._store.get(key);
        
        if (cached && cached.expiry > Date.now()) {
          this.stats.hits++;
          logger.debug(`Cache hit for key: ${key}`);
          return res.json(cached.value);
        }

        // Remove expired cache
        if (cached) {
          this._store.delete(key);
        }
        
        this.stats.misses++;
        logger.debug(`Cache miss for key: ${key}`);
        
        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = (body) => {
          const cacheEntry = {
            value: body,
            expiry: Date.now() + (duration * 1000)
          };
          this._store.set(key, cacheEntry);
          this.stats.keys = this._store.size;
          logger.debug(`Cached response for key: ${key}`);
          return originalJson.call(res, body);
        };
        
        next();
      } catch (error) {
        logger.error('Cache middleware error:', error);
        next();
      }
    };
  }

  // Clear cache by pattern
  clearCache(pattern) {
    try {
      const regex = new RegExp(pattern.replace('*', '.*'));
      let count = 0;
      for (const key of this._store.keys()) {
        if (regex.test(key)) {
          this._store.delete(key);
          count++;
        }
      }
      this.stats.keys = this._store.size;
      logger.info(`Cleared ${count} cache keys matching pattern: ${pattern}`);
      return count;
    } catch (error) {
      logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Get cache stats
  getStats() {
    return {
      ...this.stats,
      status: 'connected',
      type: 'in-memory',
      timestamp: new Date()
    };
  }

  // Set with optional expiry
  set(key, value, expiry = 3600) {
    try {
      const cacheEntry = {
        value,
        expiry: Date.now() + (expiry * 1000)
      };
      this._store.set(key, cacheEntry);
      this.stats.keys = this._store.size;
      logger.debug(`Set cache key: ${key}`);
    } catch (error) {
      logger.error('Error setting cache:', error);
      throw error;
    }
  }

  // Get with error handling
  get(key) {
    try {
      const cached = this._store.get(key);
      if (cached && cached.expiry > Date.now()) {
        this.stats.hits++;
        return cached.value;
      }
      if (cached) {
        this._store.delete(key);
      }
      this.stats.misses++;
      return null;
    } catch (error) {
      logger.error('Error getting cache:', error);
      throw error;
    }
  }

  // Delete multiple keys
  delete(...keys) {
    try {
      let count = 0;
      for (const key of keys) {
        if (this._store.delete(key)) {
          count++;
        }
      }
      this.stats.keys = this._store.size;
      logger.debug(`Deleted ${count} cache keys`);
      return count;
    } catch (error) {
      logger.error('Error deleting cache:', error);
      throw error;
    }
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, cached] of this._store.entries()) {
      if (cached.expiry <= now) {
        this._store.delete(key);
      }
    }
    this.stats.keys = this._store.size;
  }
}

// Create and export singleton instance
const cacheService = new CacheService();

// Run cleanup every minute
setInterval(() => {
  cacheService.cleanup();
}, 60000);

module.exports = cacheService; 