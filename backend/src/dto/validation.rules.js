/**
 * Validation Rules (DTOs equivalent)
 * 
 * INTERVIEW POINT: These are similar to .NET DataAnnotations or FluentValidation rules.
 * We define validation rules separately from controllers for clean code.
 */
const { body, query, param } = require('express-validator');

const productValidation = {
    create: [
        body('name')
            .trim()
            .notEmpty().withMessage('Product name is required')
            .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
        body('category')
            .trim()
            .notEmpty().withMessage('Category is required'),
        body('price')
            .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('stock')
            .optional()
            .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('universityId')
            .notEmpty().withMessage('University ID is required')
            .isUUID().withMessage('Invalid University ID format'),
        body('description')
            .optional()
            .isLength({ max: 2000 }).withMessage('Description max 2000 characters')
    ],

    update: [
        param('id').isUUID().withMessage('Invalid product ID'),
        body('name').optional().trim().isLength({ min: 2, max: 200 }),
        body('price').optional().isFloat({ min: 0 }),
        body('stock').optional().isInt({ min: 0 }),
        body('category').optional().trim().notEmpty()
    ],

    getAll: [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit: 1-100'),
        query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'category']),
        query('sortOrder').optional().isIn(['ASC', 'DESC', 'asc', 'desc'])
    ]
};

const authValidation = {
    register: [
        body('username')
            .trim()
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
        body('email')
            .trim()
            .isEmail().withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/\d/).withMessage('Password must contain a number')
    ],

    login: [
        body('email')
            .trim()
            .isEmail().withMessage('Valid email is required')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required')
    ]
};

module.exports = { productValidation, authValidation };
