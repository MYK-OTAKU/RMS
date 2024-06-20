// app.js
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { initDb, sequelize } = require('./database/sequelize');
const utilisateurRoutes = require('./routes/UtilisateurRoutes');


const app = express();

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json());

app.use('/api', utilisateurRoutes);

const syncDatabase = async () => {
  await initDb();
 

  await sequelize.sync({ force: true });
  console.log('Base de données synchronisée.');
};

syncDatabase().then(() => {
  if (require.main === module) {
    const port = process.env.PORT || 3200;
    app.listen(port, () => console.log(`Notre app marche sur http://localhost:${port}`));
  }
});

module.exports = app;
