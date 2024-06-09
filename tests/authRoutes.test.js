const request = require('supertest');
const express = require('express');
const app = express();
const authRoutes = require('../routes/UtilisateurRoutes');
const { initDb } = require('../database/sequelize');
const Utilisateurs = require('../models/Utilisateurs');
const bcrypt = require('bcryptjs'); // Assurez-vous que bcryptjs est installé

app.use(express.json());
app.use('/api', authRoutes);

describe('Tests des routes d\'authentification', () => {
  let chai;
  let expect;

  before(async () => {
    chai = await import('chai');
    expect = chai.expect;

    await initDb();
    await Utilisateurs.sync({ force: true });
  });

  it('devrait créer un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/utilisateurs')
      .send({
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'admin',
        nomUtilisateur: 'jdupont',
        motDePasse: 'password123',
        email: 'jean.dupont@example.com',
        numeroTel: '0123456789',
        adresse: '123 Rue Exemple'
      });

    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property('id');
    expect(res.body.data).to.have.property('nom', 'Dupont');
  });

  it('devrait échouer pour un utilisateur avec un email existant', async () => {
    await Utilisateurs.create({
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'admin',
      nomUtilisateur: 'jdupont2',
      motDePasse: await bcrypt.hash('password123', 10),
      email: 'jean.dupont@example.com',
      numeroTel: '0123456789',
      adresse: '123 Rue Exemple'
    });

    const res = await request(app)
      .post('/api/utilisateurs')
      .send({
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'admin',
        nomUtilisateur: 'jdupont3',
        motDePasse: 'password123',
        email: 'jean.dupont@example.com',
        numeroTel: '0123456789',
        adresse: '123 Rue Exemple'
      });

    expect(res.status).to.equal(400);
  });

  it('devrait connecter un utilisateur existant', async () => {
    await Utilisateurs.create({
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'admin',
      nomUtilisateur: 'jdupont',
      motDePasse: await bcrypt.hash('password123', 10),
      email: 'jean.dupont2@example.com',
      numeroTel: '0123456789',
      adresse: '123 Rue Exemple'
    });

    const res = await request(app)
      .post('/api/login')
      .send({
        nomUtilisateur: 'jdupont',
        motDePasse: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('devrait échouer pour une connexion avec des identifiants incorrects', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        nomUtilisateur: 'jdupont',
        motDePasse: 'wrongpassword'
      });

    expect(res.status).to.equal(401);
  });
});
