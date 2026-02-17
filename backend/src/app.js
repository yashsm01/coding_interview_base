/**
 * Express Application Setup
 * 
 * INTERVIEW TALKING POINT: This demonstrates middleware pipeline ordering,
 * which is the Express equivalent of .NET middleware pipeline.
 * Order matters: security → logging → parsing → routes → error handling
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');

// Route imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const universityRoutes = require('./routes/university.routes');
const orderRoutes = require('./routes/order.routes');

// Middleware imports
const { requestLogger } = require('./middleware/logger.middleware');
const { globalErrorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// ═══════════════════════════════════════════════════
// SECURITY MIDDLEWARE (First in pipeline)
// ═══════════════════════════════════════════════════
app.use(helmet());  // Sets security HTTP headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Rate limiting - prevents brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ═══════════════════════════════════════════════════
// PARSING & LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));       // HTTP request logging
app.use(requestLogger);            // Custom structured logging

// ═══════════════════════════════════════════════════
// SWAGGER DOCUMENTATION
// ═══════════════════════════════════════════════════
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'University Merchandise API'
}));

// ═══════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ═══════════════════════════════════════════════════
// ERROR HANDLING (Last in pipeline)
// ═══════════════════════════════════════════════════
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
