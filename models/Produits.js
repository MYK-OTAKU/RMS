module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
  });

  Product.associate = (models) => {
    // Définir l'association avec la catégorie
    Product.belongsTo(models.Category, {
      foreignKey: {
        name: 'categoryId', // Nom de la colonne de clé étrangère dans la table Products
        allowNull: false // La colonne ne peut pas être nulle
      },
      onDelete: 'CASCADE' // Supprimer les produits associés lors de la suppression de la catégorie
    });
  };

  return Product;
};
