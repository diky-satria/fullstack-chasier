"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      kode_transaksies: {
        type: Sequelize.BIGINT,
      },
      pasien_id: {
        type: Sequelize.INTEGER,
        references: { model: "pasiens", key: "id" },
      },
      dokter_id: {
        type: Sequelize.INTEGER,
        references: { model: "dokters", key: "id" },
      },
      metode_pembayaran_id: {
        type: Sequelize.INTEGER,
        references: { model: "metode_pembayarans", key: "id" },
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      diskon: {
        type: Sequelize.INTEGER,
      },
      diskon_harga: {
        type: Sequelize.BIGINT,
      },
      ppn: {
        type: Sequelize.INTEGER,
      },
      ppn_harga: {
        type: Sequelize.BIGINT,
      },
      sub_total_harga: {
        type: Sequelize.BIGINT,
      },
      total_harga: {
        type: Sequelize.BIGINT,
      },
      nominal: {
        type: Sequelize.BIGINT,
      },
      kembalian: {
        type: Sequelize.BIGINT,
      },
      timestamp: {
        type: Sequelize.BIGINT,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaksies");
  },
};
