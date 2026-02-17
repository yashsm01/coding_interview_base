/**
 * University Routes
 */
const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /universities:
 *   get:
 *     tags: [Universities]
 *     summary: Get all active universities
 *     description: Returns list of all active universities sorted by name.
 *     responses:
 *       200:
 *         description: List of universities
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
 *                     $ref: '#/components/schemas/University'
 */
router.get('/', universityController.getAll);

/**
 * @swagger
 * /universities/{id}:
 *   get:
 *     tags: [Universities]
 *     summary: Get university by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: University UUID
 *     responses:
 *       200:
 *         description: University details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/University'
 *       404:
 *         description: University not found
 */
router.get('/:id', universityController.getById);

/**
 * @swagger
 * /universities:
 *   post:
 *     tags: [Universities]
 *     summary: Create university (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Stanford University
 *               location:
 *                 type: string
 *                 example: Stanford, CA
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: store@stanford.edu
 *           examples:
 *             MIT:
 *               summary: MIT Example
 *               value:
 *                 name: MIT
 *                 location: Cambridge, MA
 *                 contactEmail: merch@mit.edu
 *             Harvard:
 *               summary: Harvard Example
 *               value:
 *                 name: Harvard University
 *                 location: Cambridge, MA
 *                 contactEmail: shop@harvard.edu
 *     responses:
 *       201:
 *         description: University created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/University'
 *       401:
 *         description: Unauthorized - JWT required
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticate, authorize('admin'), universityController.create);

/**
 * @swagger
 * /universities/{id}:
 *   put:
 *     tags: [Universities]
 *     summary: Update university (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Stanford University (Updated)
 *               location:
 *                 type: string
 *                 example: Palo Alto, CA
 *               contactEmail:
 *                 type: string
 *                 example: newstore@stanford.edu
 *     responses:
 *       200:
 *         description: University updated successfully
 *       404:
 *         description: University not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put('/:id', authenticate, authorize('admin'), universityController.update);

/**
 * @swagger
 * /universities/{id}:
 *   delete:
 *     tags: [Universities]
 *     summary: Delete university (Admin only, soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: University deleted successfully
 *       404:
 *         description: University not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete('/:id', authenticate, authorize('admin'), universityController.delete);

module.exports = router;
