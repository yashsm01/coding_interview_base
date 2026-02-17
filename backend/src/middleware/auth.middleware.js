/**
 * JWT Authentication Middleware
 * 
 * INTERVIEW POINT: This is the Express equivalent of .NET [Authorize] attribute.
 * - Extracts JWT from Authorization header
 * - Verifies token validity
 * - Attaches user info to req.user
 * - Role-based access: authorize('admin', 'manager')
 */
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Verify JWT token
 */
const redisClient = require('../config/redis.config');
const userRepository = require('../repositories/user.repository');

/**
 * Verify JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // INTERVIEW POINT: Stateful vs Stateless
        // Stateless: Trust the token signature (req.user = decoded)
        // Stateful (Requested): Check specific user record in Cache/DB (allows revocation)

        let user = null;

        // 1. Try Redis
        if (redisClient.isOpen) {
            const cachedUser = await redisClient.get(`user:${decoded.id}`);
            if (cachedUser) {
                user = JSON.parse(cachedUser);
            }
        }

        // 2. Fallback to DB if not in cache
        if (!user) {
            user = await userRepository.findById(decoded.id);
            // Cache if found
            if (user && redisClient.isOpen) {
                await redisClient.setEx(`user:${user.id}`, 10800, JSON.stringify(user));
            }
        }

        // 3. Deny if user deleted/banned even if token is valid
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User is no longer active.' });
        }

        req.user = user; // Attach full user object, not just token payload
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        logger.warn(`Invalid token attempt: ${error.message}`);
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

/**
 * Role-based authorization
 * Usage: authorize('admin', 'manager')
 * 
 * INTERVIEW POINT: Similar to .NET [Authorize(Roles = "Admin")]
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
