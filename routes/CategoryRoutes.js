const { Category } = require('../database/sequelize');

module.exports = (app) => {
  app.post('/api/RMS', (req, res) => {
    Category.create(req.body)
      .then(category => {
        const message = `La catégorie ${category.name} a bien été créée.`;
        res.status(201).json({ message, data: category });
      })
      .catch(err => {
        // Gérer les erreurs de création de catégorie
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de la catégorie.", error: err });
      });
  });
  
  
  
  app.delete('/api/category/:id', (req, res) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (category) { // Vérifiez si la catégorie est null
          const categoryDeleted = category;
          Category.destroy({
            where: { id: category.id }
          })
          .then(_ => {
            const message = `La catégorie avec l'identifiant n°${categoryDeleted.id} a bien été supprimée.`;
            res.json({ message, data: categoryDeleted });
          })
          .catch(err => {
            // Gérer les erreurs de suppression
            res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la catégorie.", error: err });
          });
        } else {
          res.status(404).json({ message: "La catégorie spécifiée n'a pas été trouvée." });
        }
      })
      .catch(err => {
        // Gérer les erreurs de recherche de la catégorie
        res.status(500).json({ message: "Une erreur s'est produite lors de la recherche de la catégorie à supprimer.", error: err });
      });
  });
  
  
  
  
  app.put('/api/category/:id', (req, res) => {
    const categoryId = req.params.id;

    Category.findByPk(categoryId)
      .then(category => {
        if (!category) {
          return res.status(404).json({ message: "La catégorie spécifiée n'a pas été trouvée." });
        }

        // Mettre à jour les champs de la catégorie avec les nouvelles valeurs
        Category.update(req.body, {
          where: { id: categoryId }
        })
          .then(numRows => {
            if (numRows[0] === 1) {
              res.status(200).json({ message: "La catégorie a été mise à jour avec succès." });
            } else {
              res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de la catégorie." });
            }
          })
          .catch(error => {
            // Gérer les erreurs lors de la mise à jour de la catégorie
            res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de la catégorie.", error });
          });
      })
      .catch(error => {
        // Gérer les erreurs lors de la recherche de la catégorie
        res.status(500).json({ message: "Une erreur s'est produite lors de la recherche de la catégorie à mettre à jour.", error });
      });
  });
};














