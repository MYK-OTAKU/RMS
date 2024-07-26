const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Routes pour les produits
router.post('/produits', authenticate, authorize(['admin', 'superadmin']), produitController.uploadImage, produitController.creerProduit);
router.get('/produits', authenticate, authorize(['admin','serveur', 'superadmin']), produitController.listeProduits);
router.get('/produits/:id', authenticate, authorize(['admin','serveur', 'superadmin']), produitController.getProduitParId);
router.put('/produits/:id', authenticate, authorize(['admin', 'superadmin']), produitController.uploadImage, produitController.mettreAJourProduit);
router.delete('/produits/:id', authenticate, authorize(['admin', 'superadmin']), produitController.supprimerProduit);

module.exports = router;
