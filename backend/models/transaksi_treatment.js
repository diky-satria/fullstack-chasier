"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi_treatments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaksi_treatments.init(
    {
      transaksies_id: DataTypes.INTEGER,
      treatment_id: DataTypes.INTEGER,
      harga_satuan: DataTypes.BIGINT,
      diskon: DataTypes.INTEGER,
      diskon_harga: DataTypes.BIGINT,
      total_harga: DataTypes.BIGINT,
      qty: DataTypes.INTEGER,
      note: DataTypes.STRING,
      timestamp: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "transaksi_treatments",
    }
  );
  return transaksi_treatments;
};
