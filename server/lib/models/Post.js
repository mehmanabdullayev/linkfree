const { DataTypes, Sequelize } = require('sequelize')

const sequelize = require('../database/sequelize')

const Post = sequelize.define(
    'Post',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: true,
        paranoid: true,
    }
)

module.exports = Post