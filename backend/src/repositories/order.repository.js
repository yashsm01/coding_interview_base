/**
 * Order Repository
 * Includes the "Top 5 Universities by Sales" query
 */
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const BaseRepository = require('./base.repository');
const { Order, University, Product } = require('../models');

class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }

    /**
     * Top 5 Universities with highest sales
     * 
     * INTERVIEW POINT: This is the SQL question translated to Sequelize.
     * Raw SQL equivalent:
     *   SELECT TOP 5 UniversityId, SUM(Amount) AS TotalSales
     *   FROM Orders
     *   GROUP BY UniversityId
     *   ORDER BY TotalSales DESC
     */
    async getTopUniversitiesBySales(topN = 5) {
        return Order.findAll({
            attributes: [
                'universityId',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalSales'],
                [Sequelize.fn('COUNT', Sequelize.col('Order.id')), 'orderCount']
            ],
            include: [{
                model: University,
                as: 'university',
                attributes: ['name', 'location']
            }],
            group: ['universityId', 'university.id', 'university.name', 'university.location'],
            order: [[Sequelize.literal('totalSales'), 'DESC']],
            limit: topN
        });
    }

    async findByUniversity(universityId) {
        return this.findAll({
            where: { universityId },
            include: [
                { model: Product, as: 'product', attributes: ['name', 'price'] }
            ],
            order: [['orderDate', 'DESC']]
        });
    }
}

module.exports = new OrderRepository();
