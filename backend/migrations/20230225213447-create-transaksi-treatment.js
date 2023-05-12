"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi_treatments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transaksies_id: {
        type: Sequelize.INTEGER,
        references: { model: "transaksies", key: "id" },
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        references: { model: "treatments", key: "id" },
      },
      harga_satuan: {
        type: Sequelize.BIGINT,
      },
      diskon: {
        type: Sequelize.INTEGER,
      },
      diskon_harga: {
        type: Sequelize.BIGINT,
      },
      total_harga: {
        type: Sequelize.BIGINT,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.STRING,
      },
      timestamp: {
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable("transaksi_treatments");
  },
};
