const auth = require("../controllers/AuthController.js");
const VerifyUser = require("../middleware/VerifyUser");
let router = require("express").Router();

const { loginValidation } = require("../validation");

router.post("/auth/login", loginValidation, auth.login);
router.get("/auth/remember_me", auth.remember_me_cek);
router.get("/auth/me", VerifyUser.VerifyUser, auth.me);
router.delete("/auth/logout", VerifyUser.VerifyUser, auth.logout);

module.exports = router;
