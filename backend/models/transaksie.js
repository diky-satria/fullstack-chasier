"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaksies.init(
    {
      user_id: DataTypes.INTEGER,
      kode_transaksies: DataTypes.BIGINT,
      pasien_id: DataTypes.INTEGER,
      dokter_id: DataTypes.INTEGER,
      metode_pembayaran_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      diskon: DataTypes.INTEGER,
      diskon_harga: DataTypes.BIGINT,
      ppn: DataTypes.INTEGER,
      ppn_harga: DataTypes.BIGINT,
      sub_total_harga: DataTypes.BIGINT,
      total_harga: DataTypes.BIGINT,
      nominal: DataTypes.BIGINT,
      kembalian: DataTypes.BIGINT,
      timestamp: DataTypes.BIGINT,
      status: DataTypes.INTEGER,
      keterangan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "transaksies",
    }
  );
  return transaksies;
};
