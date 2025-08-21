'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A product belongs to a subcategory
      Product.belongsTo(models.Subcategory, {
        foreignKey: 'subcategory_id',
        as: 'subcategory'
      });

      // A product has many variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'product_id',
        as: 'variants'
      });

      // A product has many photos
      Product.hasMany(models.ProductPhoto, {
        foreignKey: 'product_id',
        as: 'photos'
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    subcategory_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'subcategories',
        key: 'id'
      }
    },
    product_code: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 40]
      }
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 160]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    default_uom: {
      type: DataTypes.STRING(16),
      defaultValue: 'unit'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Product;
};