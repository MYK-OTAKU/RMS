const express = require('express');
const router = express.Router();
const utilisateurController = require('../Controllers/utilisateurController');
const authenticate = require('../middlewares/auth');

// Routes sans authentification
router.post('/utilisateurs', utilisateurController.creerUtilisateur);
router.post('/login', utilisateurController.connexion);

// Routes avec authentification
router.get('/utilisateurs', authenticate, utilisateurController.listeUtilisateurs);
router.get('/utilisateurs/:id', authenticate, utilisateurController.getUtilisateur);
router.put('/utilisateurs/:id', authenticate, utilisateurController.mettreAJourUtilisateur);
router.delete('/utilisateurs/:id', authenticate, utilisateurController.supprimerUtilisateur);

module.exports = router;
