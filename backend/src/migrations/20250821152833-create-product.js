'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      subcategory_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'subcategories',
          key: 'id'
        }
      },
      product_code: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      default_uom: {
        type: Sequelize.STRING(16),
        defaultValue: 'unit'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('products', {
      fields: ['subcategory_id'],
      type: 'foreign key',
      name: 'fk_prod_subcat',
      references: {
        table: 'subcategories',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};