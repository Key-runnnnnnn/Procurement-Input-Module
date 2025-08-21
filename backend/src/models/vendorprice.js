'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A vendor price belongs to a vendor listing
      VendorPrice.belongsTo(models.VendorListing, {
        foreignKey: 'vendor_listing_id',
        as: 'vendorListing'
      });
    }
  }
  VendorPrice.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    vendor_listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'vendor_listings',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    effective_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'VendorPrice',
    tableName: 'vendor_prices',
    timestamps: false,
    indexes: [
      {
        fields: ['vendor_listing_id', 'effective_from'],
        name: 'idx_vp_current'
      }
    ]
  });
  return VendorPrice;
};