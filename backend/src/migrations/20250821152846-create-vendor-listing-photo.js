'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_listing_photos', {
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
      url: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('vendor_listing_photos', {
      fields: ['vendor_listing_id'],
      type: 'foreign key',
      name: 'fk_vlp_listing',
      references: {
        table: 'vendor_listings',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendor_listing_photos');
  }
};