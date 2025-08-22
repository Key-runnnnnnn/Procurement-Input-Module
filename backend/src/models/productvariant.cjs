'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A product variant belongs to a product
      ProductVariant.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });

      // A product variant has many attributes
      ProductVariant.hasMany(models.VariantAttribute, {
        foreignKey: 'variant_id',
        as: 'attributes'
      });

      // A product variant has many vendor listings
      ProductVariant.hasMany(models.VendorListing, {
        foreignKey: 'variant_id',
        as: 'vendorListings'
      });

      // A product variant has many photos
      ProductVariant.hasMany(models.VariantPhoto, {
        foreignKey: 'variant_id',
        as: 'photos'
      });
    }
  }
  ProductVariant.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    variant_sku: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 64]
      }
    }
  }, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variants',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ProductVariant;
};