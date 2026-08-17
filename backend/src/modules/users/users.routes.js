const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateAccountStatus,
  getAccountStatusHistory,
  savePolicy,
  unsavePolicy,
  saveScheme,
  unsaveScheme,
  getSavedItems,
  exportPersonalData,
  deleteSensitiveData,
  getSearchHistory,
  addSearchQuery,
  clearSearchHistory,
} = require("./users.controller");
const { protect, authorize } = require("../auth/auth.middleware");

// Admin user administration
router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/role", protect, authorize("admin"), updateUserRole);
router.get("/:id/status-history", protect, authorize("admin"), getAccountStatusHistory);
router.patch("/:id/status", protect, authorize("admin"), updateAccountStatus);
router.delete("/:id", protect, authorize("admin"), deleteUser);

router.get("/me/export", protect, exportPersonalData);
router.delete("/me/privacy-data", protect, deleteSensitiveData);

// Saved items
router.get("/saved", protect, getSavedItems);
router.post("/save-policy", protect, savePolicy);
router.post("/unsave-policy", protect, unsavePolicy);
router.post("/save-scheme", protect, saveScheme);
router.post("/unsave-scheme", protect, unsaveScheme);

// Search history
router.get("/search-history", protect, getSearchHistory);
router.post("/search-history", protect, addSearchQuery);
router.delete("/search-history", protect, clearSearchHistory);

module.exports = router;
