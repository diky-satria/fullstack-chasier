const transaksi = require("../../controllers/kasir/TransaksiController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const {
  editTransPerTreatmentVal,
  editDiskonTransaksiVal,
  transaksiPasienBaruVal,
  transaksiPasienLamaVal,
  transaksiKonfirmasiPembayaranCashVal,
  addTransCardVal,
} = require("../../validation");

router.get("/transaksi", VerifyUser.VerifyUser, transaksi.getListTreatment);
router.get(
  "/transaksi/kode_dan_time",
  VerifyUser.VerifyUser,
  transaksi.getKodeDanTime
);
router.get("/transaksi/pasien", VerifyUser.VerifyUser, transaksi.getPasien);
router.get("/transaksi/dokter", VerifyUser.VerifyUser, transaksi.getDokter);
router.post(
  "/transaksi/pilih_treatment/:kode/:diskon_transaksi",
  VerifyUser.VerifyUser,
  addTransCardVal,
  transaksi.selectListToBucket
);
router.get(
  "/transaksi/list_treatment/:kode",
  VerifyUser.VerifyUser,
  transaksi.getListToBucket
);
router.patch(
  "/transaksi/editPerTreatment/:id/:kode/:diskon_transaksi",
  VerifyUser.VerifyUser,
  editTransPerTreatmentVal,
  transaksi.editPerTreatment
);
router.delete(
  "/transaksi/hapusPerTreatment/:id/:nama/:kode/:diskon_transaksi",
  VerifyUser.VerifyUser,
  transaksi.hapusPerTreatment
);
router.patch(
  "/transaksi/diskon_transaksi/:kode/:sub_total",
  VerifyUser.VerifyUser,
  editDiskonTransaksiVal,
  transaksi.diskonTransaksi
);
router.delete(
  "/transaksi/:kode",
  VerifyUser.VerifyUser,
  transaksi.deleteTransaksi
);
router.post(
  "/transaksi/pasien_baru",
  VerifyUser.VerifyUser,
  transaksiPasienBaruVal,
  transaksi.pasienBaru
);
router.patch(
  "/transaksi/pasien_lama",
  VerifyUser.VerifyUser,
  transaksiPasienLamaVal,
  transaksi.pasienLama
);
router.patch(
  "/transaksi/konfirmasi_pembayaran_cash/:kode",
  VerifyUser.VerifyUser,
  transaksiKonfirmasiPembayaranCashVal,
  transaksi.konfirmasiPembayaranCash
);
router.patch(
  "/transaksi/konfirmasi_pembayaran_bca/:kode",
  VerifyUser.VerifyUser,
  transaksi.konfirmasiPembayaranBCA
);
router.patch(
  "/transaksi/konfirmasi_pembayaran_non_bca/:kode",
  VerifyUser.VerifyUser,
  transaksi.konfirmasiPembayaranNonBCA
);
router.patch(
  "/transaksi/konfirmasi_pembayaran_transfer/:kode",
  VerifyUser.VerifyUser,
  transaksi.konfirmasiPembayaranTransfer
);

module.exports = router;
