'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      vendor_listing_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'vendor_listings',
          key: 'id'
        }
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      effective_from: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });

    // Add index
    await queryInterface.addIndex('vendor_prices', {
      fields: ['vendor_listing_id', 'effective_from'],
      name: 'idx_vp_current'
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('vendor_prices', {
      fields: ['vendor_listing_id'],
      type: 'foreign key',
      name: 'fk_vp_listing',
      references: {
        table: 'vendor_listings',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendor_prices');
  }
};