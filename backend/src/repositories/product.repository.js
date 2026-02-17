/**
 * Product Repository
 * Handles all Product data access logic
 * 
 * INTERVIEW POINT: Extends BaseRepository (Open/Closed Principle)
 * - Base provides generic CRUD
 * - This class adds product-specific queries WITHOUT modifying base
 */
const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const { Product, University } = require('../models');

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    /**
     * Get products with pagination, sorting, filtering, and search
     * 
     * INTERVIEW POINT: This handles the "API returning 50k records - improve performance" question
     * - Server-side pagination (not loading all records)
     * - DB-level filtering (WHERE clause, not JS filter)
     * - Projection via attributes (SELECT only needed columns)
     * - Eager loading with specific attributes
     */
    async findAllPaginated({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search = '', category = '' }) {
        const offset = (page - 1) * limit;

        // Build dynamic WHERE clause
        const where = { isActive: true };

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category) {
            where.category = category;
        }

        return this.findAll({
            where,
            include: [{
                model: University,
                as: 'university',
                attributes: ['id', 'name']   // Projection: only load needed fields
            }],
            attributes: { exclude: ['deletedAt'] },  // Don't expose soft-delete field
            order: [[sortBy, sortOrder.toUpperCase()]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    }

    async findByIdWithUniversity(id) {
        return this.findById(id, {
            include: [{
                model: University,
                as: 'university',
                attributes: ['id', 'name', 'location']
            }]
        });
    }

    async findByCategory(category) {
        return this.model.findAll({
            where: { category, isActive: true }
        });
    }

    async getCategories() {
        return this.model.findAll({
            attributes: [[this.model.sequelize.fn('DISTINCT', this.model.sequelize.col('category')), 'category']],
            where: { isActive: true },
            raw: true
        });
    }
}

module.exports = new ProductRepository();
