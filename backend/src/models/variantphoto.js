'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VariantPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A variant photo belongs to a product variant
      VariantPhoto.belongsTo(models.ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
      });
    }
  }
  VariantPhoto.init({
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
    url: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true
      }
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    alt_text: {
      type: DataTypes.STRING(160)
    }
  }, {
    sequelize,
    modelName: 'VariantPhoto',
    tableName: 'variant_photos',
    timestamps: false
  });
  return VariantPhoto;
};