const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Project = sequelize.define(
    'Project',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
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
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Project