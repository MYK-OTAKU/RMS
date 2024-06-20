const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const authenticate = require('../middlewares/auth');

// Routes pour les tables
router.post('/tables', authenticate, tableController.creerTable);
router.get('/tables', authenticate, tableController.listeTables);
router.get('/tables/:id', authenticate, tableController.getTable);
router.put('/tables/:id', authenticate, tableController.mettreAJourTable);
router.delete('/tables/:id', authenticate, tableController.supprimerTable);

module.exports = router;
