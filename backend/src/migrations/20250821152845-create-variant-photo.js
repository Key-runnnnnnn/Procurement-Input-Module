'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('variant_photos', {
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
    await queryInterface.addConstraint('variant_photos', {
      fields: ['variant_id'],
      type: 'foreign key',
      name: 'fk_vp_variant',
      references: {
        table: 'product_variants',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('variant_photos');
  }
};