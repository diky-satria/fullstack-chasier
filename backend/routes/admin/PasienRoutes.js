const pasien = require("../../controllers/admin/PasienController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { tambahPasienVal, editPasienVal } = require("../../validation");

router.get(
  "/pasien",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  pasien.getPasien
);
router.post(
  "/pasien",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  tambahPasienVal,
  pasien.addPasien
);
router.patch(
  "/pasien/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  editPasienVal,
  pasien.editPasien
);
router.delete(
  "/pasien/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  pasien.destroyPasien
);

module.exports = router;
