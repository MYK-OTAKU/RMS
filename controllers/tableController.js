const Table = require('../models/Table');
const responses = require('../utils/responses');

exports.creerTable = async (req, res) => {
  try {
    const { nom, capacite, disponibilite } = req.body;
    const table = await Table.create({
      nom,
      capacite,
      disponibilite
    });
    responses.created(res, table);
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.listeTables = async (req, res) => {
  try {
    const tables = await Table.findAll();
    responses.success(res, tables);
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.getTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (table) {
      responses.success(res, table);
    } else {
      responses.notFound(res, 'Table non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.mettreAJourTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (table) {
      await table.update(req.body);
      responses.success(res, table, 'Table mise à jour avec succès');
    } else {
      responses.notFound(res, 'Table non trouvée');
    }
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.supprimerTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (table) {
      await table.destroy();
      responses.success(res, null, 'Table supprimée avec succès');
    } else {
      responses.notFound(res, 'Table non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};
