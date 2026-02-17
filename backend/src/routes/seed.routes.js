/**
 * Seed Routes — Quick data setup for demo/testing
 * 
 * INTERVIEW POINT: In production, seeds run via migration scripts.
 * This endpoint is for development/demo convenience only.
 */
const express = require('express');
const router = express.Router();
const { University, Product, Order, User } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

/**
 * @swagger
 * /seed:
 *   post:
 *     tags: [Seed]
 *     summary: 🌱 Seed sample data (dev only)
 *     description: |
 *       Creates sample universities, products, orders, and an admin user for testing.
 *       
 *       **Admin credentials after seed:**
 *       - Email: `admin@test.com`
 *       - Password: `Admin@123`
 *       
 *       **Flow:** Seed → Login with admin → Copy token → Authorize → Use all endpoints
 *     responses:
 *       200:
 *         description: Sample data created
 *       409:
 *         description: Data already seeded
 */
router.post('/', async (req, res, next) => {
    try {
        // Check if already seeded
        const existingAdmin = await User.findOne({ where: { email: 'admin@test.com' } });
        if (existingAdmin) {
            return res.json({
                success: true,
                message: '✅ Data already seeded! Use the credentials below to login.',
                credentials: {
                    admin: { email: 'admin@test.com', password: 'Admin@123' },
                    user: { email: 'user@test.com', password: 'User@123' }
                }
            });
        }

        // 1. Create admin & regular user
        const admin = await User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Admin@123',
            role: 'admin'
        });

        const user = await User.create({
            username: 'testuser',
            email: 'user@test.com',
            password: 'User@123',
            role: 'user'
        });

        // 2. Create universities
        const universities = await University.bulkCreate([
            { name: 'MIT', location: 'Cambridge, MA', contactEmail: 'merch@mit.edu' },
            { name: 'Stanford University', location: 'Stanford, CA', contactEmail: 'store@stanford.edu' },
            { name: 'Harvard University', location: 'Cambridge, MA', contactEmail: 'shop@harvard.edu' },
            { name: 'Yale University', location: 'New Haven, CT', contactEmail: 'store@yale.edu' },
            { name: 'Princeton University', location: 'Princeton, NJ', contactEmail: 'shop@princeton.edu' }
        ]);

        // 3. Create products
        const products = await Product.bulkCreate([
            { name: 'MIT Premium Hoodie', description: 'Premium cotton hoodie with embroidered MIT logo', category: 'Apparel', price: 59.99, stock: 100, universityId: universities[0].id },
            { name: 'MIT Baseball Cap', description: 'Classic fitted baseball cap', category: 'Accessories', price: 24.99, stock: 200, universityId: universities[0].id },
            { name: 'Stanford T-Shirt', description: 'Comfortable cotton t-shirt', category: 'Apparel', price: 29.99, stock: 150, universityId: universities[1].id },
            { name: 'Stanford Notebook', description: 'Premium leather notebook', category: 'Stationery', price: 15.99, stock: 300, universityId: universities[1].id },
            { name: 'Harvard Sweatshirt', description: 'Warm fleece sweatshirt', category: 'Apparel', price: 54.99, stock: 80, universityId: universities[2].id },
            { name: 'Harvard Coffee Mug', description: 'Ceramic mug with Harvard crest', category: 'Accessories', price: 12.99, stock: 500, universityId: universities[2].id },
            { name: 'Yale Polo Shirt', description: 'Smart casual polo', category: 'Apparel', price: 44.99, stock: 120, universityId: universities[3].id },
            { name: 'Princeton Backpack', description: 'Durable canvas backpack', category: 'Accessories', price: 69.99, stock: 60, universityId: universities[4].id },
            { name: 'MIT Water Bottle', description: 'Stainless steel insulated bottle', category: 'Accessories', price: 19.99, stock: 250, universityId: universities[0].id },
            { name: 'Stanford Jacket', description: 'Lightweight windbreaker jacket', category: 'Apparel', price: 79.99, stock: 40, universityId: universities[1].id }
        ]);

        // 4. Create orders
        await Order.bulkCreate([
            { productId: products[0].id, universityId: universities[0].id, quantity: 5, amount: 299.95, status: 'delivered', orderDate: new Date('2026-01-15') },
            { productId: products[2].id, universityId: universities[1].id, quantity: 10, amount: 299.90, status: 'delivered', orderDate: new Date('2026-01-20') },
            { productId: products[4].id, universityId: universities[2].id, quantity: 3, amount: 164.97, status: 'shipped', orderDate: new Date('2026-02-01') },
            { productId: products[1].id, universityId: universities[0].id, quantity: 20, amount: 499.80, status: 'delivered', orderDate: new Date('2026-02-05') },
            { productId: products[5].id, universityId: universities[2].id, quantity: 15, amount: 194.85, status: 'confirmed', orderDate: new Date('2026-02-10') },
            { productId: products[7].id, universityId: universities[4].id, quantity: 8, amount: 559.92, status: 'delivered', orderDate: new Date('2026-01-25') },
            { productId: products[3].id, universityId: universities[1].id, quantity: 25, amount: 399.75, status: 'delivered', orderDate: new Date('2026-02-08') },
            { productId: products[9].id, universityId: universities[1].id, quantity: 6, amount: 479.94, status: 'pending', orderDate: new Date('2026-02-15') },
        ]);

        logger.info('🌱 Database seeded successfully');

        res.json({
            success: true,
            message: '🌱 Database seeded successfully!',
            data: {
                users: 2,
                universities: universities.length,
                products: products.length,
                orders: 8
            },
            credentials: {
                admin: { email: 'admin@test.com', password: 'Admin@123' },
                user: { email: 'user@test.com', password: 'User@123' }
            },
            nextSteps: [
                '1. POST /api/auth/login with admin credentials',
                '2. Copy the accessToken from the response',
                '3. Click "Authorize" button in Swagger → paste token',
                '4. Now you can use all protected endpoints!'
            ]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
