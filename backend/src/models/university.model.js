/**
 * University Model
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const University = sequelize.define('University', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        contactEmail: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: { isEmail: true }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Universities',
        timestamps: true
    });

    return University;
};
