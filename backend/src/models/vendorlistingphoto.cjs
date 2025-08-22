'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorListingPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A vendor listing photo belongs to a vendor listing
      VendorListingPhoto.belongsTo(models.VendorListing, {
        foreignKey: 'vendor_listing_id',
        as: 'vendorListing'
      });
    }
  }
  VendorListingPhoto.init({
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
    }
  }, {
    sequelize,
    modelName: 'VendorListingPhoto',
    tableName: 'vendor_listing_photos',
    timestamps: false
  });
  return VendorListingPhoto;
};