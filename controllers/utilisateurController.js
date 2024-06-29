const Utilisateurs = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, verifyToken } = require('../utils/jwt');
const responses = require('../utils/responses');
const { sendPasswordResetEmail } = require('../utils/nodemailer');
require('dotenv').config();

exports.creerUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, role, nomUtilisateur, motDePasse, email, numeroTel, adresse } = req.body;
    const utilisateur = await Utilisateurs.create({
      nom,
      prenom,
      role,
      nomUtilisateur,
      motDePasse,
      email,
      numeroTel,
      adresse
    }); 
    responses.created(res, utilisateur);
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
      return responses.notFound(res, 'Utilisateur non trouvé');
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return responses.unauthorized(res, 'Mot de passe incorrect');
    }

    const token = generateToken(utilisateur);
    res.status(200).json({ success: true, token });
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assumez que l'ID de l'utilisateur est stocké dans req.user.id
    const user = await User.findByPk(userId);
    if (user) {
      responses.success(res, user);
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

    await sendPasswordResetEmail(email, resetToken);

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

    utilisateur.motDePasse = await bcrypt.hash(newPassword, 10);
    await utilisateur.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};
