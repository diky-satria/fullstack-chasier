const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");
const { validationResult } = require("express-validator");
const helpers = require("../../helpers/index.js");
const hargaTreatment = require("../../helpers/hargaTreatment");

exports.getListTreatment = async (req, res) => {
  // parameters
  var limit = parseInt(req.query.limit) || 12;
  var offset = parseInt(req.query.offset) || 0;
  var nama = req.query.nama || "";
  var harga = parseInt(req.query.harga) || "";

  var nama_harga_query = "";
  var nama_query = "";
  var harga_query = "";
  if (nama !== "" && harga !== "") {
    nama_harga_query = `WHERE nama LIKE '%${nama}%' AND harga LIKE '%${harga}%'`;
  } else {
    nama_query = nama !== "" ? `WHERE nama LIKE '%${nama}%'` : "";
    harga_query = harga !== "" ? `WHERE harga LIKE '%${harga}%'` : "";
  }

  var data_treatment = [];
  if (offset <= 0) {
    var treatment_query = await sequelize.query(
      `SELECT id, nama, harga, gambar, timestamp FROM treatments ${nama_query} ${harga_query} ${nama_harga_query} ORDER BY timestamp DESC limit ${offset},${limit}`,
      { type: QueryTypes.SELECT }
    );

    data_treatment = treatment_query;
  } else {
    var treatment_query = await sequelize.query(
      `SELECT id, nama, harga, gambar, timestamp FROM treatments ${nama_query} ${harga_query} ${nama_harga_query} ORDER BY timestamp DESC limit ${offset},${limit}`,
      { type: QueryTypes.SELECT }
    );

    data_treatment = treatment_query;
  }

  var data_treatment_client = [];
  for (var i = 0; i < data_treatment.length; i++) {
    data_treatment_client.push({
      id: data_treatment[i].id,
      nama: data_treatment[i].nama,
      harga: hargaTreatment.harga_sanitation_detail(data_treatment[i].harga),
      gambar: data_treatment[i].gambar,
      timestamp: data_treatment[i].timestamp,
    });
  }

  return res.status(200).json({
    message: "List treatment",

    data_treatment: data_treatment_client,
    hasMore: data_treatment_client.length >= limit ? true : false,
  });
};

exports.getKodeDanTime = async (req, res) => {
  var user_id = req.session.userId;
  var time = helpers.timestamp_function();

  var kode = `${user_id}${time}`;

  return res.status(200).json({
    message: "Kode dan time",
    kode: kode,
    time: time,
  });
};

exports.getPasien = async (req, res) => {
  try {
    var pasien_query = await sequelize.query(
      `SELECT id as value, UPPER(nama) as label, telepon FROM pasiens`,
      { type: QueryTypes.SELECT }
    );
    var pasien_query_modif = [];
    for (var i = 0; i < pasien_query.length; i++) {
      pasien_query_modif.push({
        value: pasien_query[i].value,
        label: `${pasien_query[i].telepon} - ${pasien_query[i].label}`,
      });
    }

    res.status(200).json({
      message: `Data pasien`,
      data_pasien: pasien_query_modif,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getDokter = async (req, res) => {
  try {
    var dokter_query = await sequelize.query(
      `SELECT id as value, UPPER(nama) as label FROM dokters ORDER BY nama ASC`,
      { type: QueryTypes.SELECT }
    );

    res.status(200).json({
      message: `Data pasien`,
      data_dokter: dokter_query,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.selectListToBucket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      var user_id = req.session.userId;
      const { kode, diskon_transaksi } = req.params;
      const { id, nama, harga, qty, diskon, note } = req.body;

      var cek_transaksi = await sequelize.query(
        `SELECT id, kode_transaksies FROM transaksies WHERE kode_transaksies = ${kode}`,
        { type: QueryTypes.SELECT }
      );

      if (cek_transaksi.length > 0) {
        var cek_treat_terdaftar = await sequelize.query(
          `SELECT transaksi_treatments.id, transaksi_treatments.treatment_id, transaksi_treatments.total_harga, transaksi_treatments.diskon, transaksi_treatments.diskon_harga, transaksi_treatments.qty FROM transaksi_treatments JOIN transaksies ON transaksi_treatments.transaksies_id = transaksies.id WHERE transaksies.kode_transaksies = ${kode} AND transaksi_treatments.treatment_id = ${id} AND transaksi_treatments.harga_satuan = ${harga} AND transaksi_treatments.diskon = ${diskon}`,
          { type: QueryTypes.SELECT }
        );

        if (cek_treat_terdaftar.length > 0) {
          // update transaksi treatment yang sudah ada
          var disk = cek_treat_terdaftar[0].diskon;
          var qt = cek_treat_terdaftar[0].qty + qty;
          var disk_har = qt * harga * (disk / 100);
          var tot_har = qt * harga - disk_har;
          await Models.transaksi_treatments.update(
            {
              total_harga: tot_har,
              qty: qt,
              diskon: disk,
              diskon_harga: disk_har,
              note: note ? note : cek_treat_terdaftar[0].note,
              timestamp: helpers.timestamp_function(),
            },
            {
              where: {
                id: cek_treat_terdaftar[0].id,
              },
            }
          );
        } else {
          // masukan transaksi treatment ke db
          var disk = diskon;
          var qt = qty;
          var disk_har = qt * harga * (disk / 100);
          var tot_har = qt * harga - disk_har;
          await Models.transaksi_treatments.create({
            transaksies_id: cek_transaksi[0].id,
            treatment_id: id,
            harga_satuan: harga,
            diskon: disk,
            diskon_harga: disk_har,
            total_harga: tot_har,
            qty: qt,
            note: note ? note : null,
            timestamp: helpers.timestamp_function(),
          });
        }

        var query_trans_treat = await sequelize.query(
          `SELECT transaksi_treatments.treatment_id, transaksi_treatments.total_harga FROM transaksi_treatments JOIN transaksies ON transaksi_treatments.transaksies_id = transaksies.id WHERE transaksies.kode_transaksies = ${kode}`,
          { type: QueryTypes.SELECT }
        );

        var total_harga_trans_treat = 0;
        for (var i = 0; i < query_trans_treat.length; i++) {
          total_harga_trans_treat += query_trans_treat[i].total_harga;
        }

        var diskon_harga = (total_harga_trans_treat * diskon_transaksi) / 100;
        await Models.transaksies.update(
          {
            diskon: diskon_transaksi,
            diskon_harga: diskon_harga,
          },
          {
            where: {
              kode_transaksies: kode,
            },
          }
        );
      } else {
        // masukan transaksi ke db
        let query_transaksi = await Models.transaksies.create({
          user_id: user_id,
          kode_transaksies: kode,
          diskon: 0,
          diskon_harga: 0,
          timestamp: helpers.timestamp_function(),
          status: 0,
        });

        // masukan transaksi treatment ke db
        var disk = diskon;
        var qt = qty;
        var disk_har = qt * harga * (disk / 100);
        var tot_har = qt * harga - disk_har;
        await Models.transaksi_treatments.create({
          transaksies_id: query_transaksi.id,
          treatment_id: id,
          harga_satuan: harga,
          diskon: disk,
          diskon_harga: disk_har,
          total_harga: tot_har,
          qty: qt,
          note: note ? note : null,
          timestamp: helpers.timestamp_function(),
        });
      }

      res.status(200).json({
        message: `${nama} ditambahkan ke keranjang`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.getListToBucket = async (req, res) => {
  try {
    const { kode } = req.params;

    var query_transaksi = await sequelize.query(
      `SELECT transaksies.id, users.nama as nama_kasir, transaksies.kode_transaksies, transaksies.diskon, transaksies.diskon_harga, transaksies.metode_pembayaran_id, transaksies.nominal, transaksies.kembalian, transaksies.timestamp FROM transaksies JOIN users ON users.id = transaksies.user_id WHERE transaksies.kode_transaksies = ${kode}`,
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

exports.editPerTreatment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { id, kode, diskon_transaksi } = req.params;
      const {
        nama_per_treatment,
        qty_per_treatment,
        harga_per_treatment,
        diskon_per_treatment,
        note_per_treatment,
      } = req.body;

      var cek_duplikat_harga_dan_diskon = await sequelize.query(
        `SELECT transaksi_treatments.id, transaksi_treatments.diskon, transaksi_treatments.harga_satuan AS harga, transaksi_treatments.qty FROM transaksi_treatments JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id WHERE transaksies.kode_transaksies = ${kode} AND transaksi_treatments.harga_satuan = ${harga_per_treatment} AND transaksi_treatments.diskon = ${diskon_per_treatment} AND transaksi_treatments.id != ${id}`,
        { type: QueryTypes.SELECT }
      );

      if (cek_duplikat_harga_dan_diskon.length > 0) {
        var qt = cek_duplikat_harga_dan_diskon[0].qty + qty_per_treatment;
        var harga_satuan = cek_duplikat_harga_dan_diskon[0].harga;
        var diskon_harga = harga_satuan * qt * (diskon_per_treatment / 100);
        var total_harga = harga_satuan * qt - diskon_harga;

        await Models.transaksi_treatments.update(
          {
            qty: qt,
            diskon: diskon_per_treatment,
            diskon_harga: diskon_harga,
            total_harga: total_harga,
            note: note_per_treatment,
          },
          {
            where: {
              id: cek_duplikat_harga_dan_diskon[0].id,
            },
          }
        );

        await Models.transaksi_treatments.destroy({
          where: {
            id: id,
          },
        });
      } else {
        var query_harga_satuan_treat = await sequelize.query(
          `SELECT treatments.nama, transaksi_treatments.harga_satuan AS harga FROM transaksi_treatments
                                                                  JOIN treatments ON treatments.id = transaksi_treatments.treatment_id
                                                                  WHERE transaksi_treatments.id = ${id}`,
          { type: QueryTypes.SELECT }
        );

        var harga_satuan = query_harga_satuan_treat[0].harga;
        var diskon_harga =
          harga_satuan * qty_per_treatment * (diskon_per_treatment / 100);
        var total_harga = harga_satuan * qty_per_treatment - diskon_harga;

        await Models.transaksi_treatments.update(
          {
            qty: qty_per_treatment,
            diskon: diskon_per_treatment,
            diskon_harga: diskon_harga,
            total_harga: total_harga,
            note: note_per_treatment,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      var query_trans_treat = await sequelize.query(
        `SELECT transaksi_treatments.total_harga FROM transaksi_treatments JOIN transaksies ON transaksi_treatments.transaksies_id = transaksies.id WHERE transaksies.kode_transaksies = ${kode}`,
        { type: QueryTypes.SELECT }
      );

      var total_harga_trans_treat = 0;
      for (var i = 0; i < query_trans_treat.length; i++) {
        total_harga_trans_treat += query_trans_treat[i].total_harga;
      }

      var diskon_harga = (total_harga_trans_treat * diskon_transaksi) / 100;
      await Models.transaksies.update(
        {
          diskon: diskon_transaksi,
          diskon_harga: diskon_harga,
        },
        {
          where: {
            kode_transaksies: kode,
          },
        }
      );

      return res.status(200).json({
        message: `${nama_per_treatment} berhasil di edit`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.hapusPerTreatment = async (req, res) => {
  try {
    const { id, nama, kode, diskon_transaksi } = req.params;

    await Models.transaksi_treatments.destroy({
      where: {
        id: id,
      },
    });

    var query_trans_treat = await sequelize.query(
      `SELECT transaksi_treatments.total_harga FROM transaksi_treatments JOIN transaksies ON transaksi_treatments.transaksies_id = transaksies.id WHERE transaksies.kode_transaksies = ${kode}`,
      { type: QueryTypes.SELECT }
    );

    // cek apakah trans treat masih ada, jika tidak maka akan di jadikan transaksi baru
    if (query_trans_treat.length > 0) {
      var total_harga_trans_treat = 0;
      for (var i = 0; i < query_trans_treat.length; i++) {
        total_harga_trans_treat += query_trans_treat[i].total_harga;
      }

      var diskon_harga = (total_harga_trans_treat * diskon_transaksi) / 100;
      await Models.transaksies.update(
        {
          diskon: query_trans_treat.length > 0 ? diskon_transaksi : 0,
          diskon_harga: diskon_harga,
        },
        {
          where: {
            kode_transaksies: kode,
          },
        }
      );

      var reload_kode_time = false;
    } else {
      await Models.transaksies.destroy({
        where: {
          kode_transaksies: kode,
        },
      });

      var reload_kode_time = true;
    }

    return res.status(200).json({
      message: `${nama} berhasil dihapus dari keranjang`,
      reload: reload_kode_time,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.diskonTransaksi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { kode, sub_total } = req.params;
      const { diskon_transaksi } = req.body;

      var diskon_harga = (sub_total * diskon_transaksi) / 100;

      await Models.transaksies.update(
        {
          diskon: diskon_transaksi,
          diskon_harga: diskon_harga,
        },
        {
          where: {
            kode_transaksies: kode,
          },
        }
      );

      return res.status(200).json({
        message: `Diskon transaksi berhasil diedit`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.deleteTransaksi = async (req, res) => {
  try {
    const { kode } = req.params;

    var query_trans = await sequelize.query(
      `SELECT id, kode_transaksies FROM transaksies WHERE kode_transaksies = ${kode}`,
      { type: QueryTypes.SELECT }
    );

    // hapus data di trans treat
    await Models.transaksi_treatments.destroy({
      where: {
        transaksies_id: query_trans[0].id,
      },
    });

    // hapus trans
    await Models.transaksies.destroy({
      where: {
        kode_transaksies: kode,
      },
    });

    return res.status(200).json({
      message: `Transaksi ${kode} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.pasienBaru = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    const { telepon_pasien, nama_pasien } = req.body;

    let response = await Models.pasiens.create({
      nama: nama_pasien.toUpperCase(),
      telepon: telepon_pasien,
      status: 2,
    });

    try {
      return res.status(200).json({
        message: `Pasien berhasil ditambahkan`,
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.pasienLama = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { pasien_id } = req.body;

      // cek status pasien
      var cek_pasien = await sequelize.query(
        `SELECT id, status FROM pasiens WHERE id = ${pasien_id}`,
        { type: QueryTypes.SELECT }
      );
      var status_pasien = cek_pasien[0].status;

      if (status_pasien === 0) {
        await Models.pasiens.update(
          {
            status: 0,
          },
          {
            where: {
              id: pasien_id,
            },
          }
        );
      }

      return res.status(200).json({
        message: `Pasien berhasil dipilih`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.konfirmasiPembayaranCash = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { kode } = req.params;
      const {
        pasien_id,
        dokter_id,
        metode_pembayaran,
        qty,
        diskon,
        diskon_harga,
        ppn,
        ppn_harga,
        sub_total_harga,
        total_harga,
        nominal_lama,
        nominal,
        kembalian,
      } = req.body;

      // cek status pasien
      var cek_pasien = await sequelize.query(
        `SELECT id, status FROM pasiens WHERE id = ${pasien_id}`,
        { type: QueryTypes.SELECT }
      );
      var status_pasien = cek_pasien[0].status;

      // jika pasien "belum melakukan transaksi"
      if (status_pasien === 2) {
        await Models.pasiens.update(
          {
            status: 1,
          },
          {
            where: {
              id: pasien_id,
            },
          }
        );
      }
      // jika pasien baru
      if (status_pasien === 1) {
        await Models.pasiens.update(
          {
            status: 0,
          },
          {
            where: {
              id: pasien_id,
            },
          }
        );
      }

      // cek qty
      var cek_qty = await sequelize.query(
        `SELECT transaksies.kode_transaksies, SUM(transaksi_treatments.qty) as qty FROM transaksi_treatments JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id WHERE transaksies.kode_transaksies = ${kode} GROUP BY transaksies.kode_transaksies`,
        { type: QueryTypes.SELECT }
      );

      await Models.transaksies.update(
        {
          pasien_id: pasien_id,
          dokter_id: dokter_id,
          metode_pembayaran_id: metode_pembayaran,
          qty: cek_qty[0].qty,
          diskon: diskon,
          diskon_harga: diskon_harga,
          ppn: ppn,
          ppn_harga: ppn_harga,
          sub_total_harga: sub_total_harga,
          total_harga: total_harga,
          nominal: nominal,
          kembalian: kembalian,
          status: 1,
        },
        {
          where: {
            kode_transaksies: kode,
          },
        }
      );

      return res.status(200).json({
        message: `Pembayaran berhasil`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.konfirmasiPembayaranBCA = async (req, res) => {
  try {
    const { kode } = req.params;
    const {
      pasien_id,
      dokter_id,
      metode_pembayaran,
      qty,
      diskon,
      diskon_harga,
      ppn,
      ppn_harga,
      sub_total_harga,
      total_harga,
      nominal_lama,
      nominal,
      kembalian,
    } = req.body;

    // cek status pasien
    var cek_pasien = await sequelize.query(
      `SELECT id, status FROM pasiens WHERE id = ${pasien_id}`,
      { type: QueryTypes.SELECT }
    );
    var status_pasien = cek_pasien[0].status;

    // jika pasien "belum melakukan transaksi"
    if (status_pasien === 2) {
      await Models.pasiens.update(
        {
          status: 1,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }
    // jika pasien baru
    if (status_pasien === 1) {
      await Models.pasiens.update(
        {
          status: 0,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }

    // cek qty
    var cek_qty = await sequelize.query(
      `SELECT transaksies.kode_transaksies, SUM(transaksi_treatments.qty) as qty FROM transaksi_treatments JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id WHERE transaksies.kode_transaksies = ${kode} GROUP BY transaksies.kode_transaksies`,
      { type: QueryTypes.SELECT }
    );

    await Models.transaksies.update(
      {
        pasien_id: pasien_id,
        dokter_id: dokter_id,
        metode_pembayaran_id: metode_pembayaran,
        qty: cek_qty[0].qty,
        diskon: diskon,
        diskon_harga: diskon_harga,
        ppn: ppn,
        ppn_harga: ppn_harga,
        sub_total_harga: sub_total_harga,
        total_harga: total_harga,
        nominal: nominal,
        kembalian: kembalian,
        status: 1,
      },
      {
        where: {
          kode_transaksies: kode,
        },
      }
    );

    return res.status(200).json({
      message: `Pembayaran berhasil`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.konfirmasiPembayaranNonBCA = async (req, res) => {
  try {
    const { kode } = req.params;
    const {
      pasien_id,
      dokter_id,
      metode_pembayaran,
      qty,
      diskon,
      diskon_harga,
      ppn,
      ppn_harga,
      sub_total_harga,
      total_harga,
      nominal_lama,
      nominal,
      kembalian,
    } = req.body;

    // cek status pasien
    var cek_pasien = await sequelize.query(
      `SELECT id, status FROM pasiens WHERE id = ${pasien_id}`,
      { type: QueryTypes.SELECT }
    );
    var status_pasien = cek_pasien[0].status;

    // jika pasien "belum melakukan transaksi"
    if (status_pasien === 2) {
      await Models.pasiens.update(
        {
          status: 1,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }
    // jika pasien baru
    if (status_pasien === 1) {
      await Models.pasiens.update(
        {
          status: 0,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }

    // cek qty
    var cek_qty = await sequelize.query(
      `SELECT transaksies.kode_transaksies, SUM(transaksi_treatments.qty) as qty FROM transaksi_treatments JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id WHERE transaksies.kode_transaksies = ${kode} GROUP BY transaksies.kode_transaksies`,
      { type: QueryTypes.SELECT }
    );

    await Models.transaksies.update(
      {
        pasien_id: pasien_id,
        dokter_id: dokter_id,
        metode_pembayaran_id: metode_pembayaran,
        qty: cek_qty[0].qty,
        diskon: diskon,
        diskon_harga: diskon_harga,
        ppn: ppn,
        ppn_harga: ppn_harga,
        sub_total_harga: sub_total_harga,
        total_harga: total_harga,
        nominal: nominal,
        kembalian: kembalian,
        status: 1,
      },
      {
        where: {
          kode_transaksies: kode,
        },
      }
    );

    return res.status(200).json({
      message: `Pembayaran berhasil`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.konfirmasiPembayaranTransfer = async (req, res) => {
  try {
    const { kode } = req.params;
    const {
      pasien_id,
      dokter_id,
      metode_pembayaran,
      qty,
      diskon,
      diskon_harga,
      ppn,
      ppn_harga,
      sub_total_harga,
      total_harga,
      nominal_lama,
      nominal,
      kembalian,
    } = req.body;

    // cek status pasien
    var cek_pasien = await sequelize.query(
      `SELECT id, status FROM pasiens WHERE id = ${pasien_id}`,
      { type: QueryTypes.SELECT }
    );
    var status_pasien = cek_pasien[0].status;

    // jika pasien "belum melakukan transaksi"
    if (status_pasien === 2) {
      await Models.pasiens.update(
        {
          status: 1,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }
    // jika pasien baru
    if (status_pasien === 1) {
      await Models.pasiens.update(
        {
          status: 0,
        },
        {
          where: {
            id: pasien_id,
          },
        }
      );
    }

    // cek qty
    var cek_qty = await sequelize.query(
      `SELECT transaksies.kode_transaksies, SUM(transaksi_treatments.qty) as qty FROM transaksi_treatments JOIN transaksies ON transaksies.id = transaksi_treatments.transaksies_id WHERE transaksies.kode_transaksies = ${kode} GROUP BY transaksies.kode_transaksies`,
      { type: QueryTypes.SELECT }
    );

    await Models.transaksies.update(
      {
        pasien_id: pasien_id,
        dokter_id: dokter_id,
        metode_pembayaran_id: metode_pembayaran,
        qty: cek_qty[0].qty,
        diskon: diskon,
        diskon_harga: diskon_harga,
        ppn: ppn,
        ppn_harga: ppn_harga,
        sub_total_harga: sub_total_harga,
        total_harga: total_harga,
        nominal: nominal,
        kembalian: kembalian,
        status: 1,
      },
      {
        where: {
          kode_transaksies: kode,
        },
      }
    );

    return res.status(200).json({
      message: `Pembayaran berhasil`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
