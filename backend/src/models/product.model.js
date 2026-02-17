/**
 * Product Model - University Merchandise
 * 
 * Fields: Id, Name, Category, Price, UniversityId
 * INTERVIEW SCENARIO: "Create API for University Merchandise"
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: [2, 200],
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        universityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Universities',
                key: 'id'
            }
        }
    }, {
        tableName: 'Products',
        timestamps: true,
        paranoid: true,  // Soft delete
        indexes: [
            { fields: ['category'] },        // Index for filtering
            { fields: ['universityId'] },     // Index for joins
            { fields: ['price'] },            // Index for sorting
            { fields: ['name'] }              // Index for search
        ]
    });

    return Product;
};
