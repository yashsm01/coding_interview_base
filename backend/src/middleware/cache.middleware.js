/**
 * Cache Middleware
 * 
 * INTERVIEW POINT: Standard caching pattern (Cache-Aside).
 * 1. Check cache for key
 * 2. If hit, return cached data
 * 3. If miss, proceed to controller, capture response, and cache it
 */
const redisClient = require('../config/redis.config');
const logger = require('../config/logger');

const cache = (duration = 3600) => {
    return async (req, res, next) => {
        // Skip if Redis not connected
        if (!redisClient.isOpen) {
            return next();
        }

        // Create a unique key based on URL and query params
        // e.g. /api/orders/top-universities?top=5
        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                logger.info(`⚡ Cache Hit: ${key}`);
                return res.json(JSON.parse(cachedData));
            }

            logger.info(`🐢 Cache Miss: ${key}`);

            // Override res.json to intercept the response
            const originalJson = res.json;
            res.json = (body) => {
                // Cache the response asynchronously
                redisClient.setEx(key, duration, JSON.stringify(body))
                    .catch(err => logger.error('Redis Cache Error', err));

                // Send response to user
                return originalJson.call(res, body);
            };

            next();
        } catch (error) {
            logger.error('Redis Middleware Error', error);
            next();
        }
    };
};

// Helper to clear cache by pattern
const clearCache = async (pattern) => {
    if (!redisClient.isOpen) return;
    try {
        const keys = await redisClient.keys(`cache:${pattern}*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
            logger.info(`🧹 Cleared cache keys: ${keys.join(', ')}`);
        }
    } catch (error) {
        logger.error('Redis Clear Error', error);
    }
};

module.exports = { cache, clearCache };
