const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("./admin.controller");
const { protect } = require("../auth/auth.middleware");

router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

module.exports = router;
