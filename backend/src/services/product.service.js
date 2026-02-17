/**
 * Product Service - Business Logic Layer
 * 
 * INTERVIEW POINT (SOLID - SRP + DIP):
 * - Depends on repository abstraction, not direct DB access
 * - Contains business rules (validation, transformation)
 * - Controller calls service → service calls repository → repository calls DB
 */
const productRepository = require('../repositories/product.repository');
const logger = require('../config/logger');

class ProductService {
    async getAllProducts(queryParams) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search = '', category = '' } = queryParams;

        const result = await productRepository.findAllPaginated({
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder,
            search,
            category
        });

        // Transform response with pagination metadata
        return {
            data: result.rows,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
                totalItems: result.count,
                totalPages: Math.ceil(result.count / parseInt(limit)),
                hasNext: parseInt(page) < Math.ceil(result.count / parseInt(limit)),
                hasPrev: parseInt(page) > 1
            }
        };
    }

    async getProductById(id) {
        const product = await productRepository.findByIdWithUniversity(id);
        if (!product) {
            throw { status: 404, message: 'Product not found' };
        }
        return product;
    }

    async createProduct(productData) {
        const product = await productRepository.create(productData);
        logger.info(`Product created: ${product.id} - ${product.name}`);
        return product;
    }

    async updateProduct(id, updateData) {
        const product = await productRepository.update(id, updateData);
        if (!product) {
            throw { status: 404, message: 'Product not found' };
        }
        logger.info(`Product updated: ${id}`);
        return product;
    }

    async deleteProduct(id) {
        const result = await productRepository.delete(id);
        if (!result) {
            throw { status: 404, message: 'Product not found' };
        }
        logger.info(`Product soft-deleted: ${id}`);
        return { message: 'Product deleted successfully' };
    }

    async getCategories() {
        return productRepository.getCategories();
    }
}

module.exports = new ProductService();
