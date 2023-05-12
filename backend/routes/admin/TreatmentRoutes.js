const treatment = require("../../controllers/admin/TreatmentController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { tambahTreatmentVal, editTreatmentVal } = require("../../validation");

router.get(
  "/treatment",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  treatment.getTreatment
);
router.get(
  "/treatment/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  treatment.getTreatmentById
);
router.post(
  "/treatment",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  tambahTreatmentVal,
  treatment.addTreatment
);
router.patch(
  "/treatment/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  editTreatmentVal,
  treatment.editTreatment
);
router.delete(
  "/treatment/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  treatment.destroyTreatment
);
router.patch(
  "/treatment/hapus_gambar/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  treatment.destroyImage
);

module.exports = router;
