const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Like = sequelize.define(
    'Like',
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

module.exports = Like