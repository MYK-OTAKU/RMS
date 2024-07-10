const Utilisateurs = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, verifyToken } = require('../utils/jwt');
const responses = require('../utils/responses');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { sendPasswordResetEmail } = require('../utils/nodemailer');
require('dotenv').config();

exports.creerUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, role, nomUtilisateur, motDePasse, email, numeroTel, adresse, recette } = req.body;
    const utilisateur = await Utilisateurs.create({
      nom,
      prenom,
      role,
      nomUtilisateur,
      motDePasse,
      email,
      numeroTel,
      adresse,
      recette
    });
    responses.created(res, utilisateur, 'Utilisateur créé avec succès');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return responses.badRequest(res, 'Email ou nom d’utilisateur déjà utilisé');
    }
    responses.badRequest(res, error.message);
  }
};

exports.connexion = async (req, res) => {
  try {
    const { nomUtilisateur, motDePasse } = req.body;
    const utilisateur = await Utilisateurs.findOne({ where: { nomUtilisateur } });

    if (!utilisateur) {
      return res.status(404).json({ statut: 'erreur', message: 'Utilisateur non trouvé' });
    }
    
    console.log('Mot de passe envoyé:', motDePasse); // Mot de passe en texte clair
    console.log('Mot de passe stocké (haché):', utilisateur.motDePasse); // Mot de passe haché stocké

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    console.log('Mot de passe valide:', motDePasseValide); // Résultat de la comparaison
    if (!motDePasseValide) {
      return res.status(401).json({ statut: 'erreur', message: 'Mot de passe incorrect' });
    }

    if (utilisateur.twoFactorEnabled) {
      if (utilisateur.qrScanned) {
        const token = generateToken({ id: utilisateur.id, twoFactorRequired: true });
        return res.status(200).json({ success: true, token, twoFactorRequired: true });
      } else {
        const secret = speakeasy.generateSecret({ length: 20 });
        utilisateur.twoFactorSecret = secret.base32;
        await utilisateur.save();

        const otpauth_url = `otpauth://totp/${process.env.APP_NAME}:${utilisateur.email}?secret=${secret.base32}&issuer=${process.env.APP_NAME}`;

        QRCode.toDataURL(otpauth_url, (err, data_url) => {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de la génération du QR code' });
          }

          const token = generateToken({ id: utilisateur.id, twoFactorRequired: true });
          res.status(200).json({ success: true, token, twoFactorRequired: true, qrCodeUrl: data_url });
        });
      }
    } else {
      const token = generateToken({ id: utilisateur.id });
      res.status(200).json({ success: true, token, twoFactorRequired: false });
    }
  } catch (error) {
    res.status(500).json({ statut: 'erreur', message: error.message });
  }
};

exports.verifyTwoFactor = async (req, res) => {
  try {
    const { token, twoFactorCode } = req.body;
    const decoded = verifyToken(token);
    const utilisateur = await Utilisateurs.findByPk(decoded.id);

    if (!utilisateur) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('Horodatage actuel :', Date.now());

    const verified = speakeasy.totp.verify({
      secret: utilisateur.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
      window: 1 // Ajoutez une fenêtre de temps pour plus de tolérance
    });

    if (!verified) {
      console.log('Code 2FA incorrect');
      return res.status(401).json({ message: 'Code 2FA incorrect' });
    }

    utilisateur.qrScanned = true; // Marquer le QR code comme scanné
    await utilisateur.save();

    const jwtToken = generateToken({ id: utilisateur.id });
    console.log('2FA vérifié avec succès, jeton JWT généré');
    res.status(200).json({ success: true, token: jwtToken });
  } catch (error) {
    console.log('Erreur lors de la vérification 2FA :', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const utilisateur = await Utilisateurs.findByPk(userId);
    if (utilisateur) {
      responses.success(res, utilisateur);
    } else {
      responses.notFound(res, 'Utilisateur non trouvé');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.listeUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateurs.findAll();
    responses.success(res, utilisateurs);
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.getUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateurs.findByPk(req.params.id);
    if (utilisateur) {
      responses.success(res, utilisateur);
    } else {
      responses.notFound(res, 'Utilisateur non trouvé');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.mettreAJourUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateurs.findByPk(req.params.id);
    if (utilisateur) {
      await utilisateur.update(req.body);
      responses.success(res, utilisateur, 'Utilisateur mis à jour avec succès');
    } else {
      responses.notFound(res, 'Utilisateur non trouvé');
    }
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.supprimerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateurs.findByPk(req.params.id);
    if (utilisateur) {
      await utilisateur.destroy();
      responses.success(res, null, 'Utilisateur supprimé avec succès');
    } else {
      responses.notFound(res, 'Utilisateur non trouvé');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const utilisateur = await Utilisateurs.findOne({ where: { email } });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const resetToken = generateToken({ id: utilisateur.id, token });

    // Lien vers le frontend
    const resetLink = `http://localhost:4200/reset-password/${resetToken}`;

    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = verifyToken(token);
    const utilisateur = await Utilisateurs.findByPk(decoded.id);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    utilisateur.motDePasse = newPassword;
    await utilisateur.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};

exports.enableTwoFactor = async (req, res) => {
  try {
    const { userId } = req.user;
    const utilisateur = await Utilisateurs.findByPk(userId);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const secret = speakeasy.generateSecret({ length: 20 });
    utilisateur.twoFactorSecret = secret.base32;
    utilisateur.twoFactorEnabled = true;
    await utilisateur.save();

    const otpauth_url = `otpauth://totp/${process.env.APP_NAME}:${utilisateur.email}?secret=${secret.base32}&issuer=${process.env.APP_NAME}`;

    QRCode.toDataURL(otpauth_url, (err, data_url) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la génération du QR code' });
      }

      res.status(200).json({ message: '2FA activé', qrCodeUrl: data_url });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
