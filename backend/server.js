/**
 * Server Entry Point
 * Separation of concerns: server.js handles startup, app.js handles Express config
 */
require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/db.config');
const logger = require('./src/config/logger');
const db = require('./src/models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');

    // Sync models (development only - use migrations in production)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database models synchronized');
    }
  } catch (error) {
    logger.warn('⚠️  Database connection failed — server starting WITHOUT database');
    logger.warn(`   Reason: ${error.message}`);
    logger.warn('   Set DB_HOST in .env to connect to SQL Server');
  }

  // Start server regardless of DB status (Swagger + health check still work)
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
    logger.info(`❤️  Health check:  http://localhost:${PORT}/api/health`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
