'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VariantAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A variant attribute belongs to a product variant
      VariantAttribute.belongsTo(models.ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
      });

      // A variant attribute belongs to an attribute definition
      VariantAttribute.belongsTo(models.AttributeDef, {
        foreignKey: 'attribute_def_id',
        as: 'attributeDef'
      });
    }
  }
  VariantAttribute.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    variant_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'product_variants',
        key: 'id'
      }
    },
    attribute_def_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'attribute_defs',
        key: 'id'
      }
    },
    value_text: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 120]
      }
    }
  }, {
    sequelize,
    modelName: 'VariantAttribute',
    tableName: 'variant_attributes',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['variant_id', 'attribute_def_id'],
        name: 'uq_var_attr'
      },
      {
        fields: ['attribute_def_id', 'value_text'],
        name: 'idx_attr_lookup'
      }
    ]
  });
  return VariantAttribute;
};