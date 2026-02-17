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
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;  // { id, email, role }
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
