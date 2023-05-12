const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const Models = require("../../models/index.js");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
  var user_query = await sequelize.query(
    `SELECT * FROM users ORDER BY createdAt DESC`,
    { type: QueryTypes.SELECT }
  );

  return res.json({
    message: "Semua user",
    data: user_query,
  });
};

exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const {
        nama_tambah,
        username_tambah,
        password_tambah,
        konfirmasi_password_tambah,
      } = req.body;

      const encrypt_password = await bcrypt.hash(password_tambah, 10);
      let response = await Models.users.create({
        nama: nama_tambah.toUpperCase(),
        username: username_tambah,
        password: encrypt_password,
        role: "kasir",
      });

      return res.status(200).json({
        message: "User berhasil ditambahkan",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.editUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    try {
      const { nama_edit, username_lama_edit, username_edit } = req.body;
      const { id } = req.params;

      let response = await Models.users.update(
        {
          nama: nama_edit.toUpperCase(),
          username: username_edit,
        },
        {
          where: {
            id: id,
          },
        }
      );

      return res.status(200).json({
        message: "User berhasil di edit",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
};

exports.destroyUser = async (req, res) => {
  try {
    const { id } = req.params;

    await Models.users.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
