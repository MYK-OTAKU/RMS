const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize').sequelize;

const Categorie = require('./categorie');

const Produit = sequelize.define('Produit', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantiteStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imagePrincipale: {
      type: DataTypes.STRING,
    },
    creePar: {
      type: DataTypes.STRING,
    },
    misAJourPar: {
      type: DataTypes.STRING,
    },
    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: true,
  });
  
  Categorie.hasMany(Produit, { foreignKey: 'categorieId' });
  Produit.belongsTo(Categorie, { foreignKey: 'categorieId' });
  
  module.exports = Produit;