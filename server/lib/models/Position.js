const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Position = sequelize.define(
    'Position',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        employmentType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locationType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Position