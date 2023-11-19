const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Skill = sequelize.define(
    'Skill',
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
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Skill