const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  'test-seq','postgres','honey8201',
  {
    host:'localhost',
    dialect:'postgres',
  }

);
module.exports = sequelize
