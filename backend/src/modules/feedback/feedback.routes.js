const express = require("express");
const router = express.Router();
const { submitFeedback, getFeedbacks, resolveFeedback, updateTicket, addReply, getReplies, getAssignees, getMyTickets } = require("./feedback.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");

// Submit feedback (Guests & Registered Users)
router.post("/", optionalProtect, submitFeedback);
router.get("/my-tickets", protect, getMyTickets);
router.get("/assignees", protect, authorize("admin","official"), getAssignees);

// Manage feedback (Officials & Admins)
router.get("/", protect, authorize("admin", "official"), getFeedbacks);
router.get("/:id/replies", protect, getReplies);
router.post("/:id/replies", protect, authorize("admin","official"), addReply);
router.put("/:id", protect, authorize("admin","official"), updateTicket);
router.put("/:id/resolve", protect, authorize("admin", "official"), resolveFeedback);

module.exports = router;
