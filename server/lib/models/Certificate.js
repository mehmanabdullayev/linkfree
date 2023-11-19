const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Certificate = sequelize.define(
    'Certificate',
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
        issueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        expireDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        credentialID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        credentialURL: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Certificate