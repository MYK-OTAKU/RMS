const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { initDb, sequelize } = require('./config/sequelize');
const utilisateurRoutes = require('./routes/UtilisateurRoutes');
const tableRoutes = require('./routes/TableRoutes');
const categorieRoutes = require('./routes/CategorieRoutes');
const produitRoutes = require('./routes/ProduitRoutes');
const commandeRoutes = require('./routes/CommandeRoutes');
const cors = require('cors'); // Importez le module CORS
const path = require('path');
const app = express();

// Configuration des options CORS
const corsOptions = {
  origin: 'http://localhost:4200', // Remplacez par l'URL de votre application Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(cors(corsOptions))
  .use(bodyParser.json());

// Configurez Express pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api', utilisateurRoutes);
app.use('/api', tableRoutes);
app.use('/api', categorieRoutes);
app.use('/api', produitRoutes);
app.use('/api', commandeRoutes);

const syncDatabase = async () => {
  await initDb();
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ alter: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Base de données synchronisée.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
  }
};


syncDatabase().then(() => {
  if (require.main === module) {
    const port = process.env.PORT || 3200;
    app.listen(port, () => console.log(`Notre app marche sur http://localhost:${port}`));
  }
});

module.exports = app;
