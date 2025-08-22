'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttributeDef extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An attribute definition has many variant attributes
      AttributeDef.hasMany(models.VariantAttribute, {
        foreignKey: 'attribute_def_id',
        as: 'variantAttributes'
      });
    }
  }
  AttributeDef.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 64]
      }
    },
    value_type: {
      type: DataTypes.ENUM('text', 'number'),
      allowNull: false,
      defaultValue: 'text'
    }
  }, {
    sequelize,
    modelName: 'AttributeDef',
    tableName: 'attribute_defs',
    timestamps: false
  });
  return AttributeDef;
};