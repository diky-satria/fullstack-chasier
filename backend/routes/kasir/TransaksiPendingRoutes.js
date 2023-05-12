const transaksi_pending = require("../../controllers/kasir/TransaksiPendingController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

router.get(
  "/transaksi_pending",
  VerifyUser.VerifyUser,
  transaksi_pending.getListTransaksiPending
);
router.get(
  "/transaksi/kode_dan_time/:kode",
  VerifyUser.VerifyUser,
  transaksi_pending.getKodeDanTimePending
);
module.exports = router;
