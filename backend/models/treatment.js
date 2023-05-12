"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class treatments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  treatments.init(
    {
      nama: DataTypes.STRING,
      harga: DataTypes.STRING,
      gambar: DataTypes.TEXT,
      timestamp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "treatments",
    }
  );
  return treatments;
};
