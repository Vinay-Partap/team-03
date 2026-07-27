const express = require("express");
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  submitSchemeForApproval,
  approveScheme,
  rejectScheme,
  archiveScheme,
  addSchemeUpdate,
} = require("./schemes.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");

router.get("/", optionalProtect, getSchemes);
router.get("/:id", optionalProtect, getSchemeById);

// Official & Admin actions
router.post("/", protect, authorize("admin", "official"), createScheme);
router.put("/:id", protect, authorize("admin", "official"), updateScheme);
router.delete("/:id", protect, authorize("admin", "official"), deleteScheme);

// Workflow routing
router.put("/:id/submit", protect, authorize("admin", "official"), submitSchemeForApproval);
router.put("/:id/approve", protect, authorize("admin"), approveScheme);
router.put("/:id/reject", protect, authorize("admin"), rejectScheme);
router.put("/:id/archive", protect, authorize("admin"), archiveScheme);

// News/Updates logging
router.post("/:id/updates", protect, authorize("admin", "official"), addSchemeUpdate);

module.exports = router;
