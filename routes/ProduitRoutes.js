const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const authenticate = require('../middlewares/auth');

// Routes pour les produits
router.post('/produits', authenticate, produitController.creerProduit);
router.get('/produits', authenticate, produitController.listeProduits);
router.get('/produits/:id', authenticate, produitController.getProduitParId);
router.put('/produits/:id', authenticate, produitController.mettreAJourProduit);
router.delete('/produits/:id', authenticate, produitController.supprimerProduit);

module.exports = router;
