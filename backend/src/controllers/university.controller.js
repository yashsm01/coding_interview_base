/**
 * University Controller
 * 
 * INTERVIEW POINT: Follows same Controller → Service pattern as other controllers.
 * Consistent structure across all controllers demonstrates professional coding.
 */
const { University } = require('../models');
const logger = require('../config/logger');

class UniversityController {
    async getAll(req, res, next) {
        try {
            const universities = await University.findAll({
                where: { isActive: true },
                order: [['name', 'ASC']]
            });
            res.json({ success: true, data: universities });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const university = await University.findByPk(req.params.id);
            if (!university) {
                return res.status(404).json({ success: false, error: 'University not found' });
            }
            res.json({ success: true, data: university });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const university = await University.create(req.body);
            logger.info(`University created: ${university.id} - ${university.name}`);
            res.status(201).json({ success: true, data: university });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const university = await University.findByPk(req.params.id);
            if (!university) {
                return res.status(404).json({ success: false, error: 'University not found' });
            }
            await university.update(req.body);
            logger.info(`University updated: ${university.id}`);
            res.json({ success: true, data: university });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const university = await University.findByPk(req.params.id);
            if (!university) {
                return res.status(404).json({ success: false, error: 'University not found' });
            }
            await university.update({ isActive: false });
            logger.info(`University deactivated: ${university.id}`);
            res.json({ success: true, message: 'University deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UniversityController();
