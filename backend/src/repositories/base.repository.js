/**
 * Base Repository - Generic CRUD operations
 * 
 * INTERVIEW POINT (SOLID - DIP + SRP):
 * - All repositories extend this base class
 * - Controllers never access the database directly
 * - Easy to swap ORM or data source without changing business logic
 * - Similar to .NET Generic Repository Pattern
 */
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return this.model.findAndCountAll(options);
    }

    async findById(id, options = {}) {
        return this.model.findByPk(id, options);
    }

    async findOne(where, options = {}) {
        return this.model.findOne({ where, ...options });
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(id, data) {
        const [affectedCount] = await this.model.update(data, {
            where: { id }
        });
        if (affectedCount === 0) return null;
        return this.findById(id);
    }

    async delete(id) {
        // Soft delete (paranoid mode)
        return this.model.destroy({ where: { id } });
    }

    async count(where = {}) {
        return this.model.count({ where });
    }
}

module.exports = BaseRepository;
