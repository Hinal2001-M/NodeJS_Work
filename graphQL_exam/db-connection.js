const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'graphql',
  'postgres',
  'honey8201',
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: 5432
  },
)

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
  } catch (error) {
    console.error({
      name: error.name,
      message: error.message,
    });
  }
}

module.exports.connectToDatabase = connectToDatabase;
module.exports.sequelizeInstance = sequelize;