const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize').sequelize; // Assurez-vous que le chemin est correct

const Commande = sequelize.define('Commande', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    aDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    aTime: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    TableName: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    WaiterName: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    orderType: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    received: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    change: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    driverID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CustName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    CustPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    timestamps: true,
  });
  
  module.exports = Commande;