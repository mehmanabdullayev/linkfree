const { DataTypes, Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = require('../database/sequelize')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                // Storing passwords in plaintext in the database is terrible.
                // Hashing the value with an appropriate cryptographic hash function is better.
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        headline: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stampedSessionId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                name: 'users_email_index',
                using: 'BTREE',
                fields: ['email'],
            },
        ],
    }
)

module.exports = User