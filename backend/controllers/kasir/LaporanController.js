const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");

exports.getLaporan = async (req, res) => {
  const { ft, tt } = req.query;

  let ft_qry = Math.floor(new Date(`${ft} 00:00:00`).getTime() / 1000);
  let tt_qry = Math.floor(new Date(`${tt} 23:59:59`).getTime() / 1000);

  var laporan_query = await sequelize.query(
    `SELECT transaksies.id, transaksies.kode_transaksies, FROM_UNIXTIME(transaksies.timestamp, '%Y-%c-%d %H:%i') AS tgl, GROUP_CONCAT(treatments.nama SEPARATOR ', ') AS treatment, GROUP_CONCAT(transaksi_treatments.qty SEPARATOR ', ') AS qty, transaksies.diskon_harga, transaksies.metode_pembayaran_id, transaksies.total_harga AS total_pembayaran, metode_pembayarans.nama AS metode_pembayaran, pasiens.nama AS pasien, dokters.nama AS dokter, users.nama AS kasir, transaksies.keterangan FROM transaksies JOIN users ON users.id = transaksies.user_id JOIN metode_pembayarans ON metode_pembayarans.id = transaksies.metode_pembayaran_id JOIN pasiens ON pasiens.id = transaksies.pasien_id JOIN dokters ON dokters.id = transaksies.dokter_id JOIN transaksi_treatments ON transaksi_treatments.transaksies_id = transaksies.id JOIN treatments ON treatments.id = transaksi_treatments.treatment_id WHERE transaksies.timestamp >= ${ft_qry} AND transaksies.timestamp <= ${tt_qry} AND transaksies.status = 1 GROUP BY transaksies.id ORDER BY transaksies.timestamp DESC`,
    { type: QueryTypes.SELECT }
  );

  return res.status(200).json({
    message: "Semua Laporan",
    data: laporan_query,
  });
};

exports.getDetailLaporan = async (req, res) => {
  try {
    const { kode } = req.params;

    var query_transaksi = await sequelize.query(
      `SELECT transaksies.id, users.nama as nama_kasir, transaksies.kode_transaksies, transaksies.diskon, transaksies.diskon_harga, transaksies.metode_pembayaran_id, transaksies.nominal, transaksies.kembalian, transaksies.timestamp, pasiens.nama as nama_pasien, dokters.nama as nama_dokter FROM transaksies JOIN users ON users.id = transaksies.user_id JOIN pasiens ON pasiens.id = transaksies.pasien_id JOIN dokters ON dokters.id = transaksies.dokter_id WHERE transaksies.kode_transaksies = ${kode}`,
      { type: QueryTypes.SELECT }
    );

    // cek jika transaksi nya ad
    if (query_transaksi.length > 0) {
      var query_trans = query_transaksi[0];
      var query_transaksi_treatment = await sequelize.query(
        `SELECT 
                                                    transaksi_treatments.id,
                                                    treatment_id, 
                                                    treatments.nama,
                                                    transaksi_treatments.harga_satuan,
                                                    transaksi_treatments.diskon, transaksi_treatments.diskon_harga, transaksi_treatments.total_harga, transaksi_treatments.qty,
                                                    transaksi_treatments.note
    
                                                    FROM transaksi_treatments 
    
                                                    JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id 
                                                    JOIN treatments ON treatments.id = transaksi_treatments.treatment_id
    
                                                    WHERE transaksies.kode_transaksies = ${kode}
                                                    ORDER BY transaksi_treatments.timestamp asc`,
        { type: QueryTypes.SELECT }
      );
    } else {
      var query_trans = { diskon: 0, diskon_harga: 0 };
      var query_transaksi_treatment = [];
    }

    return res.status(200).json({
      message: "List selected treatments",
      data_transaksi: query_trans,
      data_transaksi_treatment: query_transaksi_treatment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.editKeterangan = async (req, res) => {
  try {
    const { id } = req.params;
    const { keterangan } = req.body;

    console.log("id ", id);
    console.log("keterangan ", keterangan);

    await Models.transaksies.update(
      {
        keterangan: keterangan,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json({
      message: "Keterangan berhasil di edit",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
