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
 *     parameters:
 *       - in: query
 *         name: top
 *         schema: { type: integer, default: 5 }
 *         description: Number of top universities to return
 */
router.get('/top-universities', orderController.getTopUniversities);

/**
 * @swagger
 * /api/orders/university/{universityId}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by university
 */
router.get('/university/:universityId', orderController.getByUniversity);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order (JWT required)
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', authenticate, orderController.create);

module.exports = router;
