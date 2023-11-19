const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Location = sequelize.define(
    'Location',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Location