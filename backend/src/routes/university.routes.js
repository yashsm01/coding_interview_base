/**
 * University Routes
 * 
 * Now uses UniversityController (consistent with other routes)
 */
const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/universities:
 *   get:
 *     tags: [Universities]
 *     summary: Get all universities
 */
router.get('/', universityController.getAll);

/**
 * @swagger
 * /api/universities/{id}:
 *   get:
 *     tags: [Universities]
 *     summary: Get university by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/:id', universityController.getById);

/**
 * @swagger
 * /api/universities:
 *   post:
 *     tags: [Universities]
 *     summary: Create university (Admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', authenticate, authorize('admin'), universityController.create);

/**
 * @swagger
 * /api/universities/{id}:
 *   put:
 *     tags: [Universities]
 *     summary: Update university (Admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', authenticate, authorize('admin'), universityController.update);

/**
 * @swagger
 * /api/universities/{id}:
 *   delete:
 *     tags: [Universities]
 *     summary: Delete university (Admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', authenticate, authorize('admin'), universityController.delete);

module.exports = router;
