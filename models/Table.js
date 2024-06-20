const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize').sequelize;

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disponibilite: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Table;
