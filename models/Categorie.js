const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize').sequelize;

const Categorie = sequelize.define('Categorie', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });
  
  module.exports = Categorie;