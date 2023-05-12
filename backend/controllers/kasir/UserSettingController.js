const Models = require("../../models/index.js");
const { sequelize } = require("../../models/index.js");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs"); // gunakan bcryptjs jika ingin membandingkan password encrypt dari php/laravel/ci (jika menggunakan "bcrypt" saja maka tidak berfungsi)
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.ubahPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    // cek user berdasarkan username yang di input
    const user = await sequelize.query(
      `SELECT * FROM users WHERE username = "${req.params.username}"`,
      { type: QueryTypes.SELECT }
    );

    if (user.length > 0) {
      const password = await bcrypt.compare(
        req.body.password_lama,
        user[0].password
      );

      if (password) {
        const cekPasswordBaru = await bcrypt.compare(
          req.body.password_baru,
          user[0].password
        );

        if (cekPasswordBaru) {
          return res.status(422).json({
            errors: {
              msg: "Password baru tidak boleh sama dengan password lama",
              param: "password_baru",
            },
          });
        }

        const encrypt_password = await bcrypt.hash(req.body.password_baru, 10);
        await Models.users.update(
          {
            password: encrypt_password,
          },
          {
            where: {
              username: req.params.username,
            },
          }
        );

        return res.status(200).json({
          msg: "Ubah password berhasil",
        });
      } else {
        return res.status(422).json({
          errors: {
            msg: "Password lama salah",
            param: "password_lama",
          },
        });
      }
    } else {
      return res.status(422).json({
        errors: {
          msg: "Username tidak terdaftar",
          param: "username",
        },
      });
    }
  }
};
