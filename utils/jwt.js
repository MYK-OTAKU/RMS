// project-root/utils/jwt.js
// utils/jwt.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      nomUtilisateur: user.nomUtilisateur,
      role: user.role
    },
    secretKey,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
