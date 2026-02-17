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
    // Handle Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors?.[0]?.path || 'field';
        const value = err.errors?.[0]?.value || '';
        return res.status(409).json({
            success: false,
            error: {
                message: `${field} '${value}' already exists`,
                statusCode: 409
            }
        });
    }

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: messages,
                statusCode: 400
            }
        });
    }

    // Handle Sequelize foreign key errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Referenced record does not exist. Check your IDs.',
                statusCode: 400
            }
        });
    }

    // Default error handling
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
