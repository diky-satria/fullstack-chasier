const { body, validationResult } = require("express-validator");
const { sequelize } = require("../models/index.js");
const { QueryTypes } = require("sequelize");
const helpers = require("../helpers");

exports.loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username harus di isi")
    .custom(async (username) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length < 1) {
        throw new Error("username tidak terdaftar");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password harus di isi"),
];

exports.tambahUserVal = [
  body("nama_tambah").notEmpty().withMessage("Nama harus di isi"),
  body("username_tambah")
    .notEmpty()
    .withMessage("Username harus di isi")
    .isLength({ min: 6 })
    .withMessage("Username minimal 6 karakter")
    .custom(async (username) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Username sudah terdaftar");
      }
      return true;
    }),
  body("password_tambah")
    .notEmpty()
    .withMessage("Password harus di isi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("konfirmasi_password_tambah")
    .notEmpty()
    .withMessage("Konfirmasi password harus di isi")
    .custom((value, { req }) => {
      if (value !== req.body.password_tambah) {
        throw new Error("Konfirmasi password salah");
      }
      return true;
    }),
];

exports.editUserVal = [
  body("nama_edit").notEmpty().withMessage("Nama harus di isi"),
  body("username_edit")
    .notEmpty()
    .withMessage("Username harus di isi")
    .isLength({ min: 6 })
    .withMessage("Username minimal 6 karakter")
    .custom(async (username, { req }) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (username !== req.body.username_lama_edit && cek.length > 0) {
        throw new Error("Username sudah terdaftar");
      }
      return true;
    }),
];

exports.tambahBarangVal = [
  body("nama_tambah")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama) => {
      const cek = await sequelize.query(
        `SELECT * FROM barangs WHERE nama = '${nama}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.editBarangVal = [
  body("nama_edit")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama_edit, { req }) => {
      const cek = await sequelize.query(
        `SELECT * FROM barangs WHERE nama = '${nama_edit}'`,
        { type: QueryTypes.SELECT }
      );
      if (nama_edit !== req.body.nama_lama_edit && cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.tambahDokterVal = [
  body("nama_tambah")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama_tambah) => {
      const cek = await sequelize.query(
        `SELECT * FROM dokters WHERE nama = '${nama_tambah}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.editDokterVal = [
  body("nama_edit")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama_edit, { req }) => {
      const cek = await sequelize.query(
        `SELECT * FROM dokters WHERE nama = '${nama_edit}'`,
        { type: QueryTypes.SELECT }
      );
      if (nama_edit !== req.body.nama_lama_edit && cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.tambahPasienVal = [
  body("nama_tambah").notEmpty().withMessage("Nama harus di isi"),
  body("telepon_tambah")
    .notEmpty()
    .withMessage("Telepon harus di isi")
    .isNumeric()
    .withMessage("Telepon harus angka")
    .isLength({ max: 15 })
    .withMessage("Telepon maksimal 15 karakter")
    .custom(async (telepon_tambah) => {
      const cek = await sequelize.query(
        `SELECT telepon FROM pasiens WHERE telepon = '${telepon_tambah}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Telepon sudah terdaftar");
      }
      return true;
    }),
];

exports.editPasienVal = [
  body("nama_edit").notEmpty().withMessage("Nama harus di isi"),
  body("telepon_edit")
    .notEmpty()
    .withMessage("Telepon harus di isi")
    .isNumeric()
    .withMessage("Telepon harus angka")
    .isLength({ max: 15 })
    .withMessage("Telepon maksimal 15 karakter")
    .custom(async (telepon_edit, { req }) => {
      const cek = await sequelize.query(
        `SELECT telepon FROM pasiens WHERE telepon = '${telepon_edit}'`,
        { type: QueryTypes.SELECT }
      );
      if (telepon_edit !== req.body.telepon_lama_edit && cek.length > 0) {
        throw new Error("Telepon sudah terdaftar");
      }
      return true;
    }),
];

exports.tambahTreatmentVal = [
  body("nama_tambah")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama_tambah) => {
      const cek = await sequelize.query(
        `SELECT * FROM treatments WHERE nama = '${nama_tambah}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.editTreatmentVal = [
  body("nama_edit")
    .notEmpty()
    .withMessage("Nama harus di isi")
    .custom(async (nama_edit, { req }) => {
      const cek = await sequelize.query(
        `SELECT * FROM treatments WHERE nama = '${nama_edit}'`,
        { type: QueryTypes.SELECT }
      );
      if (nama_edit !== req.body.nama_lama_edit && cek.length > 0) {
        throw new Error("Nama sudah terdaftar");
      }
      return true;
    }),
];

exports.addTransCardVal = [
  body("harga")
    .notEmpty()
    .withMessage("Harga harus di pilih")
    .isNumeric()
    .withMessage("Harga harus angka"),
  body("qty")
    .notEmpty()
    .withMessage("Qty harus di isi")
    .isNumeric()
    .withMessage("Qty harus angka")
    .isInt({ min: 1 })
    .withMessage("Qty minimal 1"),
  body("diskon")
    .notEmpty()
    .withMessage("Diskon harus di isi")
    .isInt({ min: 0, max: 100 })
    .withMessage("Diskon harus angka antara 0 sampai 100"),
];

exports.editTransPerTreatmentVal = [
  body("harga_per_treatment")
    .notEmpty()
    .withMessage("Harga harus di pilih")
    .isNumeric()
    .withMessage("Harga harus angka"),
  body("qty_per_treatment")
    .notEmpty()
    .withMessage("Qty harus di isi")
    .isNumeric()
    .withMessage("Qty harus angka")
    .isInt({ min: 1 })
    .withMessage("Qty minimal 1"),
  body("diskon_per_treatment")
    .notEmpty()
    .withMessage("Diskon harus di isi")
    .isInt({ min: 0, max: 100 })
    .withMessage("Diskon harus angka antara 0 sampai 100"),
];

exports.editDiskonTransaksiVal = [
  body("diskon_transaksi")
    .isInt({ min: 0, max: 100 })
    .withMessage("Diskon harus angka antara 0 sampai 100"),
];

exports.transaksiPasienBaruVal = [
  body("nama_pasien").notEmpty().withMessage("Nama harus di isi"),
  body("telepon_pasien")
    .notEmpty()
    .withMessage("Telepon harus di isi")
    .isNumeric()
    .withMessage("Telepon harus angka")
    .isLength({ max: 15 })
    .withMessage("Telepon maksimal 15 karakter")
    .custom(async (telepon) => {
      const cek = await sequelize.query(
        `SELECT telepon FROM pasiens WHERE telepon = '${telepon}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length > 0) {
        throw new Error(
          "Data ini sudah terdaftar!!! silahkan pilih pasien di tab pasien lama"
        );
      }
      return true;
    }),
];

exports.transaksiPasienLamaVal = [
  body("pasien_id").notEmpty().withMessage("Pasien harus dipilih"),
];

exports.transaksiKonfirmasiPembayaranCashVal = [
  body("nominal")
    .notEmpty()
    .withMessage("Nominal harus di isi")
    .isNumeric()
    .withMessage("Nominal harus angka")
    .custom(async (nominal, { req }) => {
      if (nominal < req.body.nominal_lama) {
        throw new Error(
          `Nominal minimal harus ${helpers.formatNumberNoRp(
            req.body.nominal_lama
          )}`
        );
      }
      return true;
    }),
];

exports.ubahPasswordVal = [
  body("password_lama")
    .notEmpty()
    .withMessage("Password lama harus di isi")
    .isLength({ min: 6 })
    .withMessage("Password lama minimal 6 karakter"),
  body("password_baru")
    .notEmpty()
    .withMessage("Password baru harus di isi")
    .isLength({ min: 6 })
    .withMessage("Password baru minimal 6 karakter"),
  body("konfirmasi_password_baru")
    .notEmpty()
    .withMessage("Konfirmasi password baru harus di isi")
    .custom((value, { req }) => {
      if (value !== req.body.password_baru) {
        throw new Error("Konfirmasi password baru salah");
      }
      return true;
    }),
];
