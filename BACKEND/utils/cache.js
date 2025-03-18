const Redis = require('ioredis');
const { logger } = require('./logger');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('ready', () => {
      logger.info('Redis ready to accept commands');
    });
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

    return async (req, res, next) => {
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
        const cachedResponse = await this.redis.get(key);
        
        if (cachedResponse) {
          logger.debug(`Cache hit for key: ${key}`);
          return res.json(JSON.parse(cachedResponse));
        }

        logger.debug(`Cache miss for key: ${key}`);
        
        // Override res.json to cache the response
        res.originalJson = res.json;
        res.json = async (body) => {
          try {
            await this.redis.setex(key, duration, JSON.stringify(body));
            logger.debug(`Cached response for key: ${key}`);
          } catch (error) {
            logger.error('Error caching response:', error);
          }
          res.originalJson(body);
        };
        
        next();
      } catch (error) {
        logger.error('Cache middleware error:', error);
        next();
      }
    };
  }

  // Clear cache by pattern with monitoring
  async clearCache(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        const pipeline = this.redis.pipeline();
        keys.forEach(key => pipeline.del(key));
        await pipeline.exec();
        logger.info(`Cleared ${keys.length} cache keys matching pattern: ${pattern}`);
        return keys.length;
      }
      return 0;
    } catch (error) {
      logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Get cache stats
  async getStats() {
    try {
      const info = await this.redis.info();
      return {
        info,
        status: 'connected',
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Set with optional expiry
  async set(key, value, expiry = null) {
    try {
      if (expiry) {
        await this.redis.setex(key, expiry, JSON.stringify(value));
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
      logger.debug(`Set cache key: ${key}`);
    } catch (error) {
      logger.error('Error setting cache:', error);
      throw error;
    }
  }

  // Get with error handling
  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Error getting cache:', error);
      throw error;
    }
  }

  // Delete multiple keys
  async delete(...keys) {
    try {
      if (keys.length === 0) return 0;
      const result = await this.redis.del(keys);
      logger.debug(`Deleted ${result} cache keys`);
      return result;
    } catch (error) {
      logger.error('Error deleting cache:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const cacheService = new CacheService();
module.exports = cacheService; 