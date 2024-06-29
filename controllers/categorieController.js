const Categorie = require('../models/categorie');
const responses = require('../utils/responses');

exports.creerCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const categorie = await Categorie.create({ nom, description });
    responses.created(res, categorie, 'Catégorie créée avec succès');
  } catch (error) {
    responses.badRequest(res, error.message, 'Erreur lors de la création de la catégorie');
  }
};

exports.listeCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    if (Array.isArray(categories)) {
      responses.success(res, categories);
    } else {
      responses.serverError(res, 'La réponse n\'est pas un tableau.');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.getCategorieParId = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (categorie) {
      responses.success(res, categorie);
    } else {
      responses.notFound(res, 'Catégorie non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.mettreAJourCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (categorie) {
      await categorie.update(req.body);
      responses.success(res, categorie, 'Catégorie mise à jour avec succès');
    } else {
      responses.notFound(res, 'Catégorie non trouvée');
    }
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.supprimerCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (categorie) {
      await categorie.destroy();
      responses.success(res, null, 'Catégorie supprimée avec succès');
    } else {
      responses.notFound(res, 'Catégorie non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};
