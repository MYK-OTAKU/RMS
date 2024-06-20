const { verifyToken } = require('../utils/jwt');
const responses = require('../utils/responses');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return responses.unauthorized(res, 'Token non fourni');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return responses.unauthorized(res, 'Token non fourni');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return responses.unauthorized(res, 'Token invalide');
  }
};

module.exports = authenticate;
