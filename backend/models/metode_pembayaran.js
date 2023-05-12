'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class metode_pembayarans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  metode_pembayarans.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'metode_pembayarans',
  });
  return metode_pembayarans
};