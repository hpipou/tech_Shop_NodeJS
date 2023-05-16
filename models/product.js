'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {foreignKey: {name: 'idUser', allowNull: false}}),
      Product.hasMany(models.Review)
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    productDetails: DataTypes.STRING,
    productImage: DataTypes.STRING,
    productPrice: DataTypes.INTEGER,
    idUser: DataTypes.UUID,
    reviewNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};