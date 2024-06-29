const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const authenticate = require('../middlewares/auth');

// Routes pour les catégories
router.post('/categories', authenticate, categorieController.creerCategorie);
router.get('/categories', authenticate, categorieController.listeCategories);
router.get('/categories/:id', authenticate, categorieController.getCategorieParId);
router.put('/categories/:id', authenticate, categorieController.mettreAJourCategorie);
router.delete('/categories/:id', authenticate, categorieController.supprimerCategorie);

module.exports = router;
