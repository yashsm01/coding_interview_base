/**
 * Order Model
 * Used for: Top 5 universities query, sales analytics
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Products', key: 'id' }
        },
        universityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Universities', key: 'id' }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 }
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        orderDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Orders',
        timestamps: true,
        indexes: [
            { fields: ['universityId'] },
            { fields: ['productId'] },
            { fields: ['orderDate'] },
            { fields: ['status'] }
        ]
    });

    return Order;
};
