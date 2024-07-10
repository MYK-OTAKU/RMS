const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Routes sans authentification
router.post('/utilisateurs', utilisateurController.creerUtilisateur);
router.post('/login', utilisateurController.connexion);
router.post('/request-password-reset', utilisateurController.requestPasswordReset);

router.put('/reset-password/:token', utilisateurController.resetPassword);
// Routes avec authentification
router.get('/utilisateurs', authenticate, authorize(['admin', 'superadmin']), utilisateurController.listeUtilisateurs);
router.get('/utilisateurs/profil', authenticate, utilisateurController.getUserProfile);
router.get('/utilisateurs/:id', authenticate, authorize(['admin', 'superadmin']), utilisateurController.getUtilisateur);
router.put('/utilisateurs/:id', authenticate, authorize(['admin', 'superadmin']), utilisateurController.mettreAJourUtilisateur);
router.delete('/utilisateurs/:id', authenticate, authorize(['admin', 'superadmin']), utilisateurController.supprimerUtilisateur);
router.post('/logout', authenticate, utilisateurController.logout);
router.post('/enable-2fa', authenticate, utilisateurController.enableTwoFactor);
router.post('/verify-2fa', utilisateurController.verifyTwoFactor);

module.exports = router;
