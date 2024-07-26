const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tableController');
const authenticate = require('../middlewares/auth'); // Middleware d'authentification
const authorize = require('../middlewares/authorize'); // Middleware d'autorisation

// Définissez les routes pour les tables
router.post('/tables', authenticate, authorize(['admin', 'superadmin']), tablesController.creerTable);
router.get('/tables', authenticate, authorize(['admin','serveur', 'superadmin']), tablesController.listeTables);
router.get('/tables/:id', authenticate, authorize(['admin', 'serveur','superadmin']), tablesController.getTableParId);
router.put('/tables/:id', authenticate, authorize(['admin', 'superadmin']), tablesController.mettreAJourTable);
router.delete('/tables/:id', authenticate, authorize(['admin', 'superadmin']), tablesController.supprimerTable);

module.exports = router;
