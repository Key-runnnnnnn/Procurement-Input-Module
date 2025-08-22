'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A product photo belongs to a product
      ProductPhoto.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  ProductPhoto.init({
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
    modelName: 'ProductPhoto',
    tableName: 'product_photos',
    timestamps: false
  });
  return ProductPhoto;
};