'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attribute_defs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      value_type: {
        type: Sequelize.ENUM('text', 'number'),
        allowNull: false,
        defaultValue: 'text'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attribute_defs');
  }
};