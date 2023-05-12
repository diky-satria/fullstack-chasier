const user = require("../../controllers/admin/UserController.js");
const VerifyUser = require("../../middleware/VerifyUser");
let router = require("express").Router();

const { tambahUserVal, editUserVal } = require("../../validation");

router.get("/user", VerifyUser.VerifyUser, VerifyUser.VerifyRole, user.getUser);
router.post(
  "/user",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  tambahUserVal,
  user.addUser
);
router.patch(
  "/user/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  editUserVal,
  user.editUser
);
router.delete(
  "/user/:id",
  VerifyUser.VerifyUser,
  VerifyUser.VerifyRole,
  user.destroyUser
);

module.exports = router;
