'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      variant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'product_variants',
          key: 'id'
        }
      },
      vendor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id'
        }
      },
      vendor_sku: {
        type: Sequelize.STRING(64)
      },
      pack_size: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        defaultValue: 'INR'
      },
      min_order_qty: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      lead_time_days: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      }
    });

    // Add unique constraint
    await queryInterface.addConstraint('vendor_listings', {
      fields: ['variant_id', 'vendor_id'],
      type: 'unique',
      name: 'uq_listing'
    });

    // Add index
    await queryInterface.addIndex('vendor_listings', {
      fields: ['variant_id'],
      name: 'idx_listing_variant'
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('vendor_listings', {
      fields: ['variant_id'],
      type: 'foreign key',
      name: 'fk_vl_variant',
      references: {
        table: 'product_variants',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('vendor_listings', {
      fields: ['vendor_id'],
      type: 'foreign key',
      name: 'fk_vl_vendor',
      references: {
        table: 'vendors',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendor_listings');
  }
};