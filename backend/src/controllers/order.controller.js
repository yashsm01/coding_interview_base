/**
 * Order Controller
 */
const orderService = require('../services/order.service');

class OrderController {
    async getTopUniversities(req, res, next) {
        try {
            const topN = parseInt(req.query.top) || 5;
            const result = await orderService.getTopUniversities(topN);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getByUniversity(req, res, next) {
        try {
            const result = await orderService.getOrdersByUniversity(req.params.universityId);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
