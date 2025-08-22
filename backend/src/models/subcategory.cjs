'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A subcategory belongs to a category
      Subcategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // A subcategory has many products
      Subcategory.hasMany(models.Product, {
        foreignKey: 'subcategory_id',
        as: 'products'
      });
    }
  }
  Subcategory.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 120]
      }
    }
  }, {
    sequelize,
    modelName: 'Subcategory',
    tableName: 'subcategories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['category_id', 'name'],
        name: 'uq_subcat'
      }
    ]
  });
  return Subcategory;
};