const setting = require("../../controllers/kasir/UserSettingController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { ubahPasswordVal } = require("../../validation");

router.patch(
  `/setting/ubah_password/:username`,
  VerifyUser.VerifyUser,
  ubahPasswordVal,
  setting.ubahPassword
);

module.exports = router;
