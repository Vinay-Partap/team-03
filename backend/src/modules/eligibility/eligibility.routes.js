const express = require("express");
const router = express.Router();
const { checkEligibility, checkMyEligibility } = require("./eligibility.controller");
const { protect } = require("../auth/auth.middleware");

// Public search query checker
router.post("/check", checkEligibility);

// Logged-in profile checker
router.get("/check-my", protect, checkMyEligibility);

module.exports = router;
