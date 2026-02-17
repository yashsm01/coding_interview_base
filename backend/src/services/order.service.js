/**
 * Order Service
 */
const orderRepository = require('../repositories/order.repository');
const logger = require('../config/logger');

class OrderService {
    async getTopUniversities(topN = 5) {
        return orderRepository.getTopUniversitiesBySales(topN);
    }

    async getOrdersByUniversity(universityId) {
        return orderRepository.findByUniversity(universityId);
    }

    async createOrder(orderData) {
        const order = await orderRepository.create(orderData);
        logger.info(`Order created: ${order.id}`);
        return order;
    }
}

module.exports = new OrderService();
