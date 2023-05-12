const dokter = require("../../controllers/admin/DokterController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { tambahDokterVal, editDokterVal } = require("../../validation");

router.get(
  "/dokter",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  dokter.getDokter
);
router.post(
  "/dokter",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  tambahDokterVal,
  dokter.addDokter
);
router.patch(
  "/dokter/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  editDokterVal,
  dokter.editDokter
);
router.delete(
  "/dokter/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  dokter.destroyDokter
);

module.exports = router;
