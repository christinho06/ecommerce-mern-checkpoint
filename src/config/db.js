const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ces valeurs viennent de ton fichier .env (voir .env.example)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // passe à console.log si tu veux voir les requêtes SQL générées
  }
);

module.exports = sequelize;
