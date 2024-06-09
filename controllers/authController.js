const Utilisateurs = require('../models/Utilisateurs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription d'un nouvel utilisateur
exports.inscription = async (req, res) => {
  try {
    const { nom, prenom, role, nomUtilisateur, email, motDePasse, numeroTel, adresse } = req.body;
    const utilisateur = await Utilisateurs.create({
      nom,
      prenom,
      role,
      nomUtilisateur,
      email,
      motDePasse,
      numeroTel,
      adresse,
    });
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Connexion d'un utilisateur
exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await Utilisateurs.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: utilisateur.id }, 'votre_secret_jwt', { expiresIn: '150000h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
