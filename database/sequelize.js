const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('rms', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false,
});

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('La connexion a été établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
};

module.exports = { sequelize, initDb };
