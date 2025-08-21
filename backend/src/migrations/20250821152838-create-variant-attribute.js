'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('variant_attributes', {
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
      attribute_def_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'attribute_defs',
          key: 'id'
        }
      },
      value_text: {
        type: Sequelize.STRING(120),
        allowNull: false
      }
    });

    // Add unique constraint
    await queryInterface.addConstraint('variant_attributes', {
      fields: ['variant_id', 'attribute_def_id'],
      type: 'unique',
      name: 'uq_var_attr'
    });

    // Add index for attribute lookups
    await queryInterface.addIndex('variant_attributes', {
      fields: ['attribute_def_id', 'value_text'],
      name: 'idx_attr_lookup'
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('variant_attributes', {
      fields: ['variant_id'],
      type: 'foreign key',
      name: 'fk_va_variant',
      references: {
        table: 'product_variants',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('variant_attributes', {
      fields: ['attribute_def_id'],
      type: 'foreign key',
      name: 'fk_va_attrdef',
      references: {
        table: 'attribute_defs',
        field: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('variant_attributes');
  }
};