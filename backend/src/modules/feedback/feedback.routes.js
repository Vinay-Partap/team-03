const express = require("express");
const router = express.Router();
const { submitFeedback, getFeedbacks, resolveFeedback } = require("./feedback.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");

// Submit feedback (Guests & Registered Users)
router.post("/", optionalProtect, submitFeedback);

// Manage feedback (Officials & Admins)
router.get("/", protect, authorize("admin", "official"), getFeedbacks);
router.put("/:id/resolve", protect, authorize("admin", "official"), resolveFeedback);

module.exports = router;
