const Commande = require('../models/Commande');
const DetailCommande = require('../models/DetailsCommande');
const responses = require('../utils/responses');

exports.creerCommande = async (req, res) => {
  try {
    const { aDate, aTime, TableName, WaiterName, status, orderType, total, received, change, driverID, CustName, CustPhone, details } = req.body;
    const commande = await Commande.create({ aDate, aTime, TableName, WaiterName, status, orderType, total, received, change, driverID, CustName, CustPhone });
    
    if (details && details.length > 0) {
      for (const detail of details) {
        await DetailCommande.create({ CommandeId: commande.id, ...detail });
      }
    }

    responses.created(res, commande, 'Commande créée avec succès');
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.listeCommandes = async (req, res) => {
  try {
    const commandes = await Commande.findAll({ include: DetailCommande });
    responses.success(res, commandes);
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.getCommandeParId = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, { include: DetailCommande });
    if (commande) {
      responses.success(res, commande);
    } else {
      responses.notFound(res, 'Commande non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};

exports.mettreAJourCommande = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (commande) {
      await commande.update(req.body);
      responses.success(res, commande, 'Commande mise à jour avec succès');
    } else {
      responses.notFound(res, 'Commande non trouvée');
    }
  } catch (error) {
    responses.badRequest(res, error.message);
  }
};

exports.supprimerCommande = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (commande) {
      await commande.destroy();
      responses.success(res, null, 'Commande supprimée avec succès');
    } else {
      responses.notFound(res, 'Commande non trouvée');
    }
  } catch (error) {
    responses.serverError(res, error.message);
  }
};
