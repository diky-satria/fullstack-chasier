const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const { timeConverter, timeConverter2 } = require("../../helpers/index.js");

exports.getDashboard = async (req, res) => {
  var dateFrom = req.query.ft;
  var dateTo = req.query.tt;

  var df = Math.floor(new Date(`${dateFrom} 00:00:00`).getTime() / 1000);
  var dt = Math.floor(new Date(`${dateTo} 23:59:59`).getTime() / 1000);

  // top treatment
  var top_treatment = await sequelize.query(
    `SELECT transaksi_treatments.treatment_id, treatments.nama, sum(transaksi_treatments.qty) as qty FROM transaksi_treatments join transaksies on transaksies.id = transaksi_treatments.transaksies_id join treatments on treatments.id = transaksi_treatments.treatment_id where transaksies.timestamp >= ${df} and transaksies.timestamp <= ${dt} and transaksies.status = 1 group by treatments.nama order by qty desc limit 10`,
    { type: QueryTypes.SELECT }
  );
  console.log("\n");
  console.log(top_treatment);
  console.log("\n");

  var selisih_hari = dt - df;
  var hari_loop = Math.round(selisih_hari / 86400);

  // var tampung_hari = [];
  var ft = dateFrom
    ? Math.floor(new Date(`${dateFrom} 00:00:00`).getTime() / 1000)
    : "0";
  var tt = dateTo
    ? Math.floor(new Date(`${dateFrom} 23:59:59`).getTime()) / 1000
    : "0";

  var dataChart = [
    {
      name: "Total transaksi",
      data: [],
    },
    {
      name: "Total pendapatan",
      data: [],
    },
  ];
  var labelChart = [];
  for (var i = 0; i < hari_loop; i++) {
    if (i === 0) {
      tt = tt;
      ft = ft;
    } else {
      tt = tt + 86400;
      ft = tt - 86399;
    }

    var transaksi_per_hari = await sequelize.query(
      `select count(timestamp) as total from transaksies WHERE timestamp >= ${ft} and timestamp <= ${tt} and status = 1`,
      { type: QueryTypes.SELECT }
    );

    // cek pendapatan
    var cek = await sequelize.query(
      `SELECT * FROM transaksies where timestamp >= ${ft} and timestamp <= ${tt} and status = 1`,
      { type: QueryTypes.SELECT }
    );
    var tot = 0;
    for (var j = 0; j < cek.length; j++) {
      if (cek[j].metode_pembayaran_id === 3) {
        tot =
          tot +
          (cek[j].total_harga + Math.floor((cek[j].total_harga * 3) / 100));
      } else {
        tot = tot + cek[j].total_harga;
      }
    }

    var t_trans =
      transaksi_per_hari.length > 0 ? transaksi_per_hari[0].total : 0;
    var p_trans = tot;

    dataChart[0].data.push(t_trans);
    dataChart[1].data.push(p_trans);
    labelChart.push(timeConverter2(ft));
  }

  return res.status(200).json({
    message: "Detail dashboard",
    data_chart: dataChart,
    label_chart: labelChart,
    top_treatment: top_treatment,
  });
};

exports.getDetailPerDay = async (req, res) => {
  const { tanggal } = req.params;

  let ft_qry = Math.floor(new Date(`${tanggal} 00:00:00`).getTime() / 1000);
  let tt_qry = Math.floor(new Date(`${tanggal} 23:59:59`).getTime() / 1000);

  var transaksi_query = await sequelize.query(
    `SELECT transaksies.id, transaksies.kode_transaksies, FROM_UNIXTIME(transaksies.timestamp, '%Y-%c-%d %H:%i') AS tgl, GROUP_CONCAT(treatments.nama SEPARATOR ', ') AS treatment, transaksies.qty, transaksies.diskon_harga, transaksies.metode_pembayaran_id, transaksies.total_harga AS total_pembayaran, metode_pembayarans.nama AS metode_pembayaran, pasiens.nama AS pasien, dokters.nama AS dokter, users.nama AS kasir, transaksies.keterangan, transaksi_treatments.note FROM transaksies JOIN users ON users.id = transaksies.user_id JOIN metode_pembayarans ON metode_pembayarans.id = transaksies.metode_pembayaran_id JOIN pasiens ON pasiens.id = transaksies.pasien_id JOIN dokters ON dokters.id = transaksies.dokter_id JOIN transaksi_treatments ON transaksi_treatments.transaksies_id = transaksies.id JOIN treatments ON treatments.id = transaksi_treatments.treatment_id WHERE transaksies.timestamp >= ${ft_qry} AND transaksies.timestamp <= ${tt_qry} AND transaksies.status = 1 GROUP BY transaksies.id ORDER BY transaksies.timestamp DESC`,
    { type: QueryTypes.SELECT }
  );

  var pendapatan_per_hari = await sequelize.query(
    `SELECT FROM_UNIXTIME(timestamp, '%Y-%c-%d') as tanggal, SUM(total_harga) as total FROM transaksies where timestamp >= ${ft_qry} and timestamp <= ${tt_qry} and status = 1 group by tanggal`,
    { type: QueryTypes.SELECT }
  );

  // cek pendapatan
  var cek = await sequelize.query(
    `SELECT * FROM transaksies where timestamp >= ${ft_qry} and timestamp <= ${tt_qry} and status = 1`,
    { type: QueryTypes.SELECT }
  );
  var tot = 0;
  for (var i = 0; i < cek.length; i++) {
    if (cek[i].metode_pembayaran_id === 3) {
      tot =
        tot + (cek[i].total_harga + Math.floor((cek[i].total_harga * 3) / 100));
    } else {
      tot = tot + cek[i].total_harga;
    }
  }

  return res.status(200).json({
    message: "Semua Transaksi hari ini",
    data: transaksi_query,
    pendapatan_perhari: tot,
  });
};
