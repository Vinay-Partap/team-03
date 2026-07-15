const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("./notifications.controller");
const { protect } = require("../auth/auth.middleware");

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
