// middlewares/auth.js

const { verifyToken } = require('../utils/jwt');
const responses = require('../utils/responses');

const authenticate = (req, res, next) => {
  // Extraction du token de l'en-tête Authorization
  const token = req.headers['authorization'];

  // Vérifier si le token existe
  if (!token) {
    return responses.unauthorized(res, 'Token non fourni');
  }

  try {
    // Vérifier et décoder le token
    const decoded = verifyToken(token.split(' ')[1]); // Supprimer "Bearer " du token
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next(); // Passer au middleware ou route suivante
  } catch (error) {
    return responses.unauthorized(res, 'Token invalide');
  }
};

module.exports = authenticate;
