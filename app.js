const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { initDb } = require('./database/sequelize');
const utilisateurRoutes = require('./routes/UtilisateurRoutes');

const port = 3200;
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json());

// Initialiser la base de données et synchroniser les modèles
const syncDatabase = async () => {
  await initDb();
  await require('./models/Utilisateurs').sync({ force: true }); // Attention: force: true recrée la table à chaque démarrage
  console.log('Base de données synchronisée.');
};

// Appel des routes
app.use('/api', utilisateurRoutes);

syncDatabase().then(() => {
  app.listen(port, () => console.log(`Notre app marche sur http://localhost:${port}`));
});
