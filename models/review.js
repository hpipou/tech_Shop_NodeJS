'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {foreignKey:{name:'idUser', allowNull:false}}),
      Review.belongsTo(models.Product, {foreignKey:{name:'idProduct', allowNull:false}})
    }
  }
  Review.init({ 
    review: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    idUser: DataTypes.UUID,
    idProduc: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};