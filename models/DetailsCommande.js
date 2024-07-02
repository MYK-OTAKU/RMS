const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize').sequelize; // Assurez-vous que le chemin est correct

const Commande = require('./Commande');

const DetailCommande = sequelize.define('DetailCommande', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CommandeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Commande,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    proID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
  
  Commande.hasMany(DetailCommande, { foreignKey: 'CommandeId' });
  DetailCommande.belongsTo(Commande, { foreignKey: 'CommandeId' });
  
  module.exports = DetailCommande;