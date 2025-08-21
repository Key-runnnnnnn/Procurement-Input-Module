'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      url: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      alt_text: {
        type: Sequelize.STRING(160)
      }
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('product_photos', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'fk_pp_product',
      references: {
        table: 'products',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_photos');
  }
};