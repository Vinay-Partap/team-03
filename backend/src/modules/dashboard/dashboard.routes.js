const express = require("express");
const router = express.Router();
const {
  getCitizenDashboardData,
  getGovernmentDashboardData,
  getAdminDashboardData,
} = require("./dashboard.controller");
const { protect, authorize } = require("../auth/auth.middleware");

router.get("/citizen", protect, getCitizenDashboardData);
router.get("/government", protect, authorize("admin", "official"), getGovernmentDashboardData);
router.get("/admin", protect, authorize("admin"), getAdminDashboardData);

module.exports = router;
