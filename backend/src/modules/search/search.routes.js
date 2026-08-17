const express = require("express");
const router = express.Router();
const { trackSearch, getTrending } = require("./search.controller");

router.post("/track", trackSearch);
router.get("/trending", getTrending);

module.exports = router;
