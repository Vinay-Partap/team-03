const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  savePolicy,
  unsavePolicy,
  saveScheme,
  unsaveScheme,
  getSavedItems,
  getSearchHistory,
  addSearchQuery,
  clearSearchHistory,
} = require("./users.controller");
const { protect, authorize } = require("../auth/auth.middleware");

// Admin user administration
router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/role", protect, authorize("admin"), updateUserRole);
router.delete("/:id", protect, authorize("admin"), deleteUser);

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
