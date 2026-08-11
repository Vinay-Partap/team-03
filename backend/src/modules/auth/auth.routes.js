const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refresh,
  auth0Login,
  verifyEmail,
  logout,
  logoutAll,
  getSessions,
} = require("./auth.controller");
const { protect } = require("./auth.middleware");

const { validateRegister, validateLogin } = require("./auth.validation");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", protect, logoutAll);
router.get("/sessions", protect, getSessions);
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);
router.post("/oauth/auth0", auth0Login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
