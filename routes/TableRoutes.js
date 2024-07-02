const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tableController');
const authenticate = require('../middlewares/auth'); // Middleware d'authentification

// Définissez les routes pour les tables
router.post('/tables', authenticate, tablesController.creerTable);
router.get('/tables', authenticate, tablesController.listeTables);
router.get('/tables/:id', authenticate, tablesController.getTableParId);
router.put('/tables/:id', authenticate, tablesController.mettreAJourTable);
router.delete('/tables/:id', authenticate, tablesController.supprimerTable);

module.exports = router;


