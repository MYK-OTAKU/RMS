const { Product, Category } = require('../db/sequelize');

module.exports = (app) => {
  app.post('/api/products', async (req, res) => {
    try {
      // Extraire les données du produit à partir de req.body
      const { name, price, category, availability, image, description, ingredients } = req.body;

      // Rechercher la catégorie par son nom
      const categoryInstance = await Category.findOne({ where: { name: category } });

      if (!categoryInstance) {
        return res.status(404).json({ message: "La catégorie spécifiée n'a pas été trouvée." });
      }

      // Créer le produit avec les données fournies
      const product = await Product.create({
        name,
        price,
        category: 1, // Utiliser l'ID de la catégorie trouvée
        availability,
        image,
        description,
        ingredients
      });

      const message = `Le produit ${product.name} a été créé avec succès.`;
      res.status(201).json({ message, data: product });
    } catch (error) {
      // Gérer les erreurs lors de la création du produit
      console.error("Erreur lors de la création du produit :", error);
      res.status(500).json({ message: "Une erreur s'est produite lors de la création du produit.", error });
    }
  });
};
