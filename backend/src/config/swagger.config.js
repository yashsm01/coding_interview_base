/**
 * Swagger/OpenAPI Configuration
 * 
 * INTERVIEW POINT: Demonstrates API documentation best practices.
 * Like FastAPI's auto-generated docs — fully interactive, try-it-out ready.
 */
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'University Merchandise API',
            version: '1.0.0',
            description: `
## Production-ready REST API for University Merchandise Management

### Features
- 🔐 JWT Authentication with refresh tokens
- 👥 Role-based Authorization (Admin, User, Manager)
- 📦 Full CRUD for Products, Universities, Orders
- 📊 Top Universities by Sales analytics
- 🔍 Search, Filter, Sort, Paginate
- ✅ Input validation & structured error responses

### Architecture
\`Controller → Service → Repository → Database (SOLID)\`
            `,
            contact: { name: 'Yash', email: 'yash@example.com' }
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Development' },
            { url: 'https://coding-interview-api.azurewebsites.net', description: 'Production' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token (without "Bearer" prefix)'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        username: { type: 'string', example: 'yash' },
                        email: { type: 'string', format: 'email', example: 'yash@example.com' },
                        role: { type: 'string', enum: ['admin', 'user', 'manager'], example: 'user' },
                        isActive: { type: 'boolean', example: true }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'MIT Hoodie' },
                        description: { type: 'string', example: 'Premium cotton hoodie' },
                        category: { type: 'string', example: 'Apparel' },
                        price: { type: 'number', format: 'float', example: 49.99 },
                        stock: { type: 'integer', example: 100 },
                        imageUrl: { type: 'string', example: 'https://example.com/hoodie.jpg' },
                        universityId: { type: 'string', format: 'uuid' }
                    }
                },
                University: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'MIT' },
                        location: { type: 'string', example: 'Cambridge, MA' },
                        contactEmail: { type: 'string', example: 'merch@mit.edu' }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        productId: { type: 'string', format: 'uuid' },
                        universityId: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer', example: 2 },
                        amount: { type: 'number', format: 'float', example: 99.98 },
                        status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
                        orderDate: { type: 'string', format: 'date-time' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Login successful' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { '$ref': '#/components/schemas/User' },
                                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' }
                            }
                        }
                    }
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'array', items: {} },
                        pagination: {
                            type: 'object',
                            properties: {
                                total: { type: 'integer', example: 50 },
                                page: { type: 'integer', example: 1 },
                                limit: { type: 'integer', example: 10 },
                                totalPages: { type: 'integer', example: 5 }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string', example: 'Resource not found' }
                    }
                }
            }
        },
        tags: [
            { name: 'Authentication', description: 'JWT login, register, token refresh' },
            { name: 'Products', description: 'CRUD with pagination, search, filter, sort' },
            { name: 'Universities', description: 'University management' },
            { name: 'Orders', description: 'Order management & analytics' }
        ]
    },
    apis: ['./src/routes/*.js']  // Scan route files for JSDoc annotations
};

module.exports = swaggerJSDoc(options);
