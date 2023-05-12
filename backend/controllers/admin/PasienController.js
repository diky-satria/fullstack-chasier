const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");
const { validationResult } = require("express-validator");

exports.getPasien = async (req, res) => {
  var pasien_query = await sequelize.query(
    `SELECT * FROM pasiens ORDER BY createdAt DESC`,
    { type: QueryTypes.SELECT }
  );

  return res.json({
    message: "Semua pasien",
    data: pasien_query,
  });
};

exports.addPasien = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { nama_tambah, telepon_tambah } = req.body;

      let response = await Models.pasiens.create({
        nama: nama_tambah.toUpperCase(),
        telepon: telepon_tambah,
        status: 2,
      });

      return res.status(200).json({
        message: "Pasien berhasil ditambahkan",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.editPasien = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { nama_edit, telepon_lama_edit, telepon_edit } = req.body;
      const { id } = req.params;

      let response = await Models.pasiens.update(
        {
          nama: nama_edit.toUpperCase(),
          telepon: telepon_edit,
        },
        {
          where: {
            id: id,
          },
        }
      );

      return res.status(200).json({
        message: "Pasien berhasil di edit",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.destroyPasien = async (req, res) => {
  try {
    const { id } = req.params;

    await Models.pasiens.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Pasien berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
