const express = require("express");
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  submitPolicyForApproval,
  approvePolicy,
  rejectPolicy,
  archivePolicy,
} = require("./policies.controller");
const { protect, optionalProtect, authorize } = require("../auth/auth.middleware");

router.get("/", optionalProtect, getPolicies);
router.get("/:id", optionalProtect, getPolicyById);

// Official & Admin policy actions
router.post("/", protect, authorize("admin", "official"), createPolicy);
router.put("/:id", protect, authorize("admin", "official"), updatePolicy);
router.delete("/:id", protect, authorize("admin", "official"), deletePolicy);

// Workflow routing
router.put("/:id/submit", protect, authorize("admin", "official"), submitPolicyForApproval);
router.put("/:id/approve", protect, authorize("admin", "official"), approvePolicy);
router.put("/:id/reject", protect, authorize("admin", "official"), rejectPolicy);
router.put("/:id/archive", protect, authorize("admin", "official"), archivePolicy);

module.exports = router;
