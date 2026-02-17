/**
 * Global Error Handler Middleware
 * 
 * INTERVIEW POINT: This is the Express equivalent of .NET ExceptionHandlerMiddleware.
 * - Must be the LAST middleware in pipeline (4 params: err, req, res, next)
 * - Catches all unhandled errors
 * - Returns consistent error format
 * - Never exposes stack traces in production
 */
const logger = require('../config/logger');

const globalErrorHandler = (err, req, res, next) => {
    // Default to 500 if no status set
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    logger.error(`Error ${statusCode}: ${message}`, {
        method: req.method,
        url: req.originalUrl,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Send response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

/**
 * 404 Handler - catches undefined routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.originalUrl} not found`,
            statusCode: 404
        }
    });
};

module.exports = { globalErrorHandler, notFoundHandler };
