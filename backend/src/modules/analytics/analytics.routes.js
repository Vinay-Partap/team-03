const express = require("express");
const router = express.Router();
const { trackView, getViews } = require("./analytics.controller");

router.post("/track", trackView);
router.get("/views/:targetId", getViews);

module.exports = router;
