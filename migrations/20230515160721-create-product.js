'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      productName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      productDetails: {
        allowNull: false,
        type: Sequelize.STRING
      },
      productImage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      productPrice: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      idUser: {
        allowNull: false,
        type: Sequelize.UUID,
        references:{
          model:'Users',
          key:'id'
        }
      },
      reviewNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};