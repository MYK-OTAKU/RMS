const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const responses = require('../utils/responses');

exports.creerProduit = async (req, res) => {
  try {
    const { nom, description, prix, quantiteStock, disponible, imagePrincipale, creePar, misAJourPar, categorieId } = req.body;
    const categorie = await Categorie.findByPk(categorieId);
    if (!categorie) {
      return responses.notFound(res, 'Catégorie non trouvée');
    }
    const produit = await Produit.create({ nom, description, prix, quantiteStock, disponible, imagePrincipale, creePar, misAJourPar, categorieId });
    responses.created(res, produit, 'Produit créé avec succès');
  } catch (error) {
    responses.badRequest(res, error.message, 'Erreur lors de la création du produit');
  }
};



exports.listeProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      include: {
        model: Categorie,
        as: 'Categorie'
      }
    });
    if (Array.isArray(produits)) {
      responses.success(res, produits);
    } else {
      responses.serverError(res, 'La réponse n\'est pas un tableau.');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};  

exports.getProduitParId = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (produit) {
      responses.success(res, produit);
    } else {
      responses.notFound(res, 'Produit non trouvé');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.mettreAJourProduit = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (produit) {
      await produit.update(req.body);
      responses.success(res, produit, 'Produit mis à jour avec succès');
    } else {
      responses.notFound(res, 'Produit non trouvé');
    }
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.supprimerProduit = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (produit) {
      await produit.destroy();
      responses.success(res, null, 'Produit supprimé avec succès');
    } else {
      responses.notFound(res, 'Produit non trouvé');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};
