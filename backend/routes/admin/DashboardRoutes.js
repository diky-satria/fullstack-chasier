const dashboard = require("../../controllers/admin/DashboardController.js");
const VerifyUser = require("../../middleware/VerifyUser.js");
let router = require("express").Router();

router.get(
  "/dashboard",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  dashboard.getDashboard
);
router.get(
  "/dashboard/:tanggal",
  VerifyUser.VerifyUser,
  dashboard.getDetailPerDay
);

module.exports = router;
