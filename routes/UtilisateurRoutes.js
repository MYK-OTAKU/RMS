const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const authenticate = require('../middlewares/auth');

// Routes sans authentification
router.post('/utilisateurs', utilisateurController.creerUtilisateur);
router.post('/login', utilisateurController.connexion);
router.post('/request-password-reset', utilisateurController.requestPasswordReset);
router.post('/reset-password/:token', utilisateurController.resetPassword);

// Routes avec authentification
router.get('/utilisateurs', authenticate, utilisateurController.listeUtilisateurs);
router.get('/utilisateurs', authenticate, utilisateurController.getUserProfile);
router.get('/utilisateurs/:id', authenticate, utilisateurController.getUtilisateur);
router.put('/utilisateurs/:id', authenticate, utilisateurController.mettreAJourUtilisateur);
router.delete('/utilisateurs/:id', authenticate, utilisateurController.supprimerUtilisateur);
router.post('/logout', authenticate, utilisateurController.logout);


module.exports = router;