const express = require("express");
const router = express.Router();
const { checkEligibility, checkMyEligibility, getHistory, clearHistory } = require("./eligibility.controller");
const { protect, optionalProtect } = require("../auth/auth.middleware");

// Public search query checker
router.post("/check", optionalProtect, checkEligibility);

// Logged-in profile checker
router.get("/check-my", protect, checkMyEligibility);
router.get("/history", protect, getHistory);
router.delete("/history", protect, clearHistory);

module.exports = router;
