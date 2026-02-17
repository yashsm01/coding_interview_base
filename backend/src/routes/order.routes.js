/**
 * Order Routes
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/orders/top-universities:
 *   get:
 *     tags: [Orders]
 *     summary: Get top universities by sales
 *     description: |
 *       Returns the top N universities ranked by total sales amount.
 *       
 *       **INTERVIEW POINT:** This is the SQL question — "Write a query to find
 *       top 5 universities with highest sales". Implemented using Sequelize
 *       aggregation (SUM + GROUP BY + ORDER BY + LIMIT).
 *     parameters:
 *       - in: query
 *         name: top
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 50
 *         description: Number of top universities to return
 *     responses:
 *       200:
 *         description: Top universities ranking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       universityId:
 *                         type: string
 *                         format: uuid
 *                       total_sales:
 *                         type: number
 *                         example: 15250.50
 *                       order_count:
 *                         type: integer
 *                         example: 42
 *                       university:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: MIT
 *                           location:
 *                             type: string
 *                             example: Cambridge, MA
 */
router.get('/top-universities', orderController.getTopUniversities);

/**
 * @swagger
 * /api/orders/university/{universityId}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by university
 *     description: Returns all orders for a specific university with product details.
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: University UUID
 *     responses:
 *       200:
 *         description: List of orders for the university
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/university/:universityId', orderController.getByUniversity);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order (JWT required)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, universityId, quantity, amount]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440001
 *               universityId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 149.97
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 default: pending
 *                 example: pending
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - JWT required
 */
router.post('/', authenticate, orderController.create);

module.exports = router;
