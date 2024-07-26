const { verifyToken } = require('../utils/jwt');
const responses = require('../utils/responses');
require('dotenv').config(); // Ajoutez cette ligne pour charger les variables d'environnement

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  console.log('Authorization Header:', authHeader); // Log de vérification

  if (!authHeader) {
    console.log('Token non fourni');
    return responses.unauthorized(res, 'Token non fourni');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log('Token non fourni');
    return responses.unauthorized(res, 'Token non fourni');
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET_KEY); // Passez la clé secrète ici
    console.log('Token décodé:', decoded); // Ajoutez ce log pour voir ce qui est décodé
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token invalide:', error);
    return responses.unauthorized(res, 'Token invalide');
  }
};

module.exports = authenticate;
