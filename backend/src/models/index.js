/**
 * Model Index - Sets up all models and associations
 * 
 * INTERVIEW POINT: This is the equivalent of .NET EF Core DbContext
 * where you define entity relationships (HasMany, BelongsTo, etc.)
 */
const { sequelize } = require('../config/db.config');

// Initialize models
const User = require('./user.model')(sequelize);
const Product = require('./product.model')(sequelize);
const University = require('./university.model')(sequelize);
const Order = require('./order.model')(sequelize);

// ═══════════════════════════════════════════════════
// ASSOCIATIONS (Relationships)
// ═══════════════════════════════════════════════════

// University has many Products (1:N)
University.hasMany(Product, { foreignKey: 'universityId', as: 'products' });
Product.belongsTo(University, { foreignKey: 'universityId', as: 'university' });

// University has many Orders (1:N)
University.hasMany(Order, { foreignKey: 'universityId', as: 'orders' });
Order.belongsTo(University, { foreignKey: 'universityId', as: 'university' });

// Product has many Orders (1:N)
Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
    sequelize,
    User,
    Product,
    University,
    Order
};
