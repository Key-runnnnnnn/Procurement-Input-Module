'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorListing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A vendor listing belongs to a product variant
      VendorListing.belongsTo(models.ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
      });

      // A vendor listing belongs to a vendor
      VendorListing.belongsTo(models.Vendor, {
        foreignKey: 'vendor_id',
        as: 'vendor'
      });

      // A vendor listing has many prices
      VendorListing.hasMany(models.VendorPrice, {
        foreignKey: 'vendor_listing_id',
        as: 'prices'
      });

      // A vendor listing has many photos
      VendorListing.hasMany(models.VendorListingPhoto, {
        foreignKey: 'vendor_listing_id',
        as: 'photos'
      });
    }
  }
  VendorListing.init({
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
    vendor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    vendor_sku: {
      type: DataTypes.STRING(64)
    },
    pack_size: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'INR'
    },
    min_order_qty: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    lead_time_days: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'VendorListing',
    tableName: 'vendor_listings',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['variant_id', 'vendor_id'],
        name: 'uq_listing'
      },
      {
        fields: ['variant_id'],
        name: 'idx_listing_variant'
      }
    ]
  });
  return VendorListing;
};