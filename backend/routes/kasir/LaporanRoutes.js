const laporan = require("../../controllers/kasir/LaporanController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

router.get("/laporan", VerifyUser.VerifyUser, laporan.getLaporan);
router.get("/laporan/:kode", VerifyUser.VerifyUser, laporan.getDetailLaporan);
router.patch("/keterangan/:id", VerifyUser.VerifyUser, laporan.editKeterangan);

module.exports = router;
