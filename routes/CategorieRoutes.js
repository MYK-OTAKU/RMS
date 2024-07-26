const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Routes pour les catégories
router.post('/categories', authenticate, authorize(['admin', 'superadmin']), categorieController.creerCategorie);
router.get('/categories', authenticate, authorize(['admin','serveur' ,'superadmin']), categorieController.listeCategories);
router.get('/categories/:id', authenticate, authorize(['admin', 'serveur', 'superadmin']), categorieController.getCategorieParId);
router.put('/categories/:id', authenticate, authorize(['admin', 'superadmin']), categorieController.mettreAJourCategorie);
router.delete('/categories/:id', authenticate, authorize(['admin', 'superadmin']), categorieController.supprimerCategorie);

module.exports = router;
