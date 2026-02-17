/**
 * Database Configuration - Sequelize
 * 
 * INTERVIEW POINT: Demonstrates environment-based config,
 * connection pooling, and ORM setup (similar to EF Core DbContext).
 * 
 * Supports: PostgreSQL (default), MSSQL, SQLite (fallback)
 */
const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;
const dialect = process.env.DB_DIALECT || (process.env.DB_HOST ? 'postgres' : 'sqlite');

if (dialect === 'mssql') {
    // ── SQL Server ──
    sequelize = new Sequelize(
        process.env.DB_NAME || 'UniversityMerchDB',
        process.env.DB_USER || 'sa',
        process.env.DB_PASSWORD || 'YourStrong@Password',
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 1433,
            dialect: 'mssql',
            dialectOptions: {
                options: {
                    encrypt: true,
                    trustServerCertificate: true
                }
            },
            pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
            logging: process.env.NODE_ENV === 'development' ? console.log : false
        }
    );
} else if (dialect === 'postgres') {
    // ── PostgreSQL ──
    sequelize = new Sequelize(
        process.env.DB_NAME || 'UniversityMerchDB',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '1234',
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            dialect: 'postgres',
            pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
            logging: process.env.NODE_ENV === 'development' ? console.log : false
        }
    );
} else {
    // ── SQLite (Local fallback - no DB server needed) ──
    const dbPath = path.join(__dirname, '..', '..', 'data', 'dev.sqlite');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
}

module.exports = { sequelize };
