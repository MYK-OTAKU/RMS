const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize').sequelize;
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
    type: DataTypes.ENUM('admin', 'serveur', 'cuisinier', 'client', 'superadmin'),
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
  recette: {
    type: DataTypes.FLOAT,
    allowNull: true // Seulement pour les serveurs
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qrScanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  if (utilisateur.changed('motDePasse') && !utilisateur.motDePasse.startsWith('$2a$10$')) {
    const hashedPassword = await bcrypt.hash(utilisateur.motDePasse, 10);
    utilisateur.motDePasse = hashedPassword;
  }
});

module.exports = Utilisateurs;
