const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("./auditLogs.controller");
const { protect, authorize } = require("../auth/auth.middleware");

// Admin only route
router.get("/", protect, authorize("admin"), getAuditLogs);

module.exports = router;
