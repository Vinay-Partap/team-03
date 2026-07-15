const express = require("express");
const router = express.Router();
const { getReportsData, exportCSV } = require("./reports.controller");
const { protect, authorize } = require("../auth/auth.middleware");

// Official & Admin reports
router.get("/analytics", protect, authorize("admin", "official"), getReportsData);
router.get("/export", protect, authorize("admin", "official"), exportCSV);

module.exports = router;
