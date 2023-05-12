const barang = require("../../controllers/admin/BarangController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { tambahBarangVal, editBarangVal } = require("../../validation");

router.get(
  "/barang",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  barang.getBarang
);
router.post(
  "/barang",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  tambahBarangVal,
  barang.addBarang
);
router.patch(
  "/barang/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  editBarangVal,
  barang.editBarang
);
router.delete(
  "/barang/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  barang.destroyBarang
);

module.exports = router;
