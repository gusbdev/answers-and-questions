const Sequelize = require('sequelize');

const connection = new Sequelize('qa', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;
