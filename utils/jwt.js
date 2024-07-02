const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

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
