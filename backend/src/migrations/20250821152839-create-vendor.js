'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      vendor_code: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(180),
        allowNull: false
      },
      gstin: {
        type: Sequelize.STRING(20)
      },
      contact_info: {
        type: Sequelize.JSON
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2)
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendors');
  }
};