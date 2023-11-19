const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Education = sequelize.define(
    'Education',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fieldOfStudy: {
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
        grade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        activities: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Education