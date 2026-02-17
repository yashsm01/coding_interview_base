/**
 * Request Logger Middleware
 * 
 * INTERVIEW POINT: This is how middleware works in Express —
 * it intercepts EVERY request at the pipeline level.
 * Similar to .NET Core app.UseMiddleware<RequestLoggingMiddleware>()
 */
const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log request
    logger.info(`→ ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? '***' : undefined
    });

    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

        logger[logLevel](`← ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });

    next();
};

module.exports = { requestLogger };
