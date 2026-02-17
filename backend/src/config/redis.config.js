/**
 * Redis Configuration
 * 
 * INTERVIEW POINT: demonstratres caching strategy setup.
 * Connects to Redis instance defined in env vars.
 */
const { createClient } = require('redis');
const logger = require('./logger');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('✅ Redis Client Connected'));

// Connect immediately
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        logger.warn('⚠️ Redis connection failed - caching disabled');
    }
})();

module.exports = redisClient;
