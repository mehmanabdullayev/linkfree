const { Sequelize } = require('sequelize')

const DATABASE_NAME = process.env.DATABASE_NAME || 'postgres'
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres'
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'postgres'
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost'
const DATABASE_PORT = process.env.DATABASE_PORT || '5432'

/**
 * Sequelize setup
 * @type {Sequelize}
 */
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: "postgres"
});

sequelize.authenticate().then(() => {}).catch((error) => {})

module.exports = sequelize