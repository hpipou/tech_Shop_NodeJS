'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      review: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idUser: {
        allowNull: false,
        type: Sequelize.UUID,
        references : {
          model:'Users',
          key : 'id'
        }
      },
      idProduc: {
        allowNull: false,
        type: Sequelize.UUID,
        references : {
          model: 'Products',
          key:'id'
        }
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
    await queryInterface.dropTable('Reviews');
  }
};