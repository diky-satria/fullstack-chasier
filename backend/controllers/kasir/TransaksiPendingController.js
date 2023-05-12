const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");
const helpers = require("../../helpers/index.js");

exports.getListTransaksiPending = async (req, res) => {
  let user_login = req.session.userId;
  let user_role = req.session.role;

  let query_user_role;
  if (user_role === "admin") {
    query_user_role = ``;
  } else {
    query_user_role = `AND transaksies.user_id = ${user_login}`;
  }

  var transaksi_pending = await sequelize.query(
    `SELECT transaksies.id, users.nama, kode_transaksies, SUM(transaksi_treatments.qty) as qty, transaksies.timestamp FROM transaksies JOIN users ON users.id = transaksies.user_id JOIN transaksi_treatments ON transaksi_treatments.transaksies_id = transaksies.id WHERE transaksies.status = 0 ${query_user_role} GROUP BY transaksi_treatments.transaksies_id ORDER BY transaksies.timestamp DESC`,
    { type: QueryTypes.SELECT }
  );

  return res.status(200).json({
    message: "List transaksi pending",
    data: transaksi_pending,
  });
};

exports.getKodeDanTimePending = async (req, res) => {
  var { kode } = req.params;

  var query_kode_time = await sequelize.query(
    `SELECT kode_transaksies, timestamp FROM transaksies WHERE kode_transaksies = ${kode}`,
    { type: QueryTypes.SELECT }
  );

  return res.status(200).json({
    message: "Kode dan time",
    kode: query_kode_time[0].kode_transaksies,
    time: query_kode_time[0].timestamp,
  });
};
