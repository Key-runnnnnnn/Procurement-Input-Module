'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A vendor has many vendor listings
      Vendor.hasMany(models.VendorListing, {
        foreignKey: 'vendor_id',
        as: 'listings'
      });
    }
  }
  Vendor.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    vendor_code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 32]
      }
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 180]
      }
    },
    gstin: {
      type: DataTypes.STRING(20),
      validate: {
        len: [0, 20]
      }
    },
    contact_info: {
      type: DataTypes.JSON
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 5
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Vendor',
    tableName: 'vendors',
    timestamps: false
  });
  return Vendor;
};