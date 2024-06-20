const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize').sequelize;
const bcrypt = require('bcryptjs');

const Utilisateurs = sequelize.define('Utilisateurs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'serveur', 'cuisinier', 'client'),
    allowNull: false
  },
  nomUtilisateur: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  numeroTel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Utilisateurs.beforeCreate(async (utilisateur, options) => {
  const hashedPassword = await bcrypt.hash(utilisateur.motDePasse, 10);
  utilisateur.motDePasse = hashedPassword;
});

Utilisateurs.beforeUpdate(async (utilisateur, options) => {
  if (utilisateur.changed('motDePasse')) {
    const hashedPassword = await bcrypt.hash(utilisateur.motDePasse, 10);
    utilisateur.motDePasse = hashedPassword;
  }
});

module.exports = Utilisateurs;
