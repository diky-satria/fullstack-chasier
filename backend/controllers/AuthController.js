const Models = require("../models/index.js");
const { sequelize } = require("../models/index.js");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs"); // gunakan bcryptjs jika ingin membandingkan password encrypt dari php/laravel/ci (jika menggunakan "bcrypt" saja maka tidak berfungsi)
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()[0],
    });
  } else {
    // cek user berdasarkan username yang di input
    const user = await sequelize.query(
      `SELECT * FROM users WHERE username = "${req.body.username}"`,
      { type: QueryTypes.SELECT }
    );

    if (user.length > 0) {
      const password = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (password) {
        // -------------------------------- menggunakan session ---------------------------------------

        req.session.userId = user[0].id;
        req.session.role = user[0].role;
        const id = user[0].id;
        const nama = user[0].nama;
        const username = user[0].username;
        const role = user[0].role;

        // remember me
        if (req.body.remember_me === true) {
          var remember_token_data = {
            id: user[0].id,
            nama: user[0].nama,
            username: user[0].username,
            role: user[0].role,
          };
          const remember_token = jwt.sign(
            remember_token_data,
            process.env.REMEMBER_ME_SECRET
          );
          res.cookie("remember_me", remember_token, {
            httpOnly: true,
            maxAge: parseInt(process.env.REMEMBER_ME_EXPIRE),
          });
        }

        res.status(200).json({
          msg: "Login berhasil",
          data: {
            id: id,
            nama: nama,
            username: username,
            role: role,
          },
        });
        // -------------------------------- akhir menggunkana session ---------------------------------
      } else {
        res.status(422).json({
          errors: {
            msg: "Password salah",
            param: "password",
          },
        });
      }
    } else {
      res.status(422).json({
        errors: {
          msg: "Username tidak terdaftar",
          param: "username",
        },
      });
    }
  }
};

exports.me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  } else {
    const user = await sequelize.query(
      `SELECT id, nama, username, role FROM users WHERE id = ${req.session.userId}`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json({
      msg: "Data user",
      data: user[0],
    });
  }
};

exports.remember_me_cek = async (req, res) => {
  const token = req.cookies.remember_me;

  jwt.verify(token, process.env.REMEMBER_ME_SECRET, async (err, user) => {
    if (err) {
      return res.json({
        msg: "remember me token salah",
        status: 400,
      });
    } else {
      req.session.userId = user.id;

      const id = user.id;
      const nama = user.nama;
      const username = user.username;
      const role = user.role;

      return res.status(200).json({
        msg: "remember me bekerja",
        status: 200,
        data: {
          id: id,
          nama: nama,
          username: username,
          role: role,
        },
      });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({
        msg: "Tidak bisa logout",
      });
    }
    res.clearCookie("remember_me");
    return res.status(200).json({
      msg: "Kamu telah logout",
    });
  });
};
