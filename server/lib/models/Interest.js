const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Interest = sequelize.define(
    'Interest',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Interest