const Utilisateurs = require('../models/Utilisateurs');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const responses = require('../utils/responses');

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
    responses.success(res, { utilisateur, token }, 'Connexion réussie');
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
