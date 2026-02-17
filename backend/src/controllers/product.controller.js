/**
 * Product Controller
 * 
 * INTERVIEW POINT: Demonstrates clean controller pattern.
 * - Thin controller: only handles HTTP concerns
 * - All business logic delegated to ProductService
 * - Error handling via next() → global error handler
 * - Consistent response format: { success, data, pagination }
 */
const productService = require('../services/product.service');
const { clearCache } = require('../middleware/cache.middleware');

class ProductController {
    /**
     * GET /api/products?page=1&limit=10&sortBy=price&sortOrder=ASC&search=hoodie&category=Apparel
     * 
     * INTERVIEW SCENARIO: "Add pagination, sorting, return total count"
     */
    async getAll(req, res, next) {
        try {
            const result = await productService.getAllProducts(req.query);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/products/:id
     */
    async getById(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/products (JWT Protected)
     */
    async create(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);
            // Invalidate product cache
            await clearCache('/api/products');
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/products/:id (JWT Protected)
     */
    async update(req, res, next) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            // Invalidate product cache
            await clearCache('/api/products');
            res.json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/products/:id (Admin only)
     */
    async delete(req, res, next) {
        try {
            const result = await productService.deleteProduct(req.params.id);
            // Invalidate product cache
            await clearCache('/api/products');
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/products/categories
     */
    async getCategories(req, res, next) {
        try {
            const categories = await productService.getCategories();
            res.json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
