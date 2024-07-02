const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Routes pour les commandes
router.post('/commandes', authenticate, authorize(['admin', 'serveur']), commandeController.creerCommande);
router.get('/commandes', authenticate, authorize(['admin', 'serveur', 'cuisinier']), commandeController.listeCommandes);
router.get('/commandes/:id', authenticate, authorize(['admin', 'serveur', 'cuisinier']), commandeController.getCommandeParId);
router.put('/commandes/:id', authenticate, authorize(['admin']), commandeController.mettreAJourCommande);
router.delete('/commandes/:id', authenticate, authorize(['admin']), commandeController.supprimerCommande);

module.exports = router;
