const User = require("./users.model");
const { logAction } = require("../auditLogs/auditLogs.service");

// Admin routes
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!["admin", "official", "citizen", "researcher", "organization", "guest"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logAction({
      action: "ADMIN_UPDATE_USER_ROLE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Updated role of ${user.email} from ${oldRole} to ${role}`,
      targetId: user._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    await logAction({
      action: "ADMIN_DELETE_USER",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Deleted user: ${user.email}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Citizen Bookmark Actions
const savePolicy = async (req, res) => {
  try {
    const { policyId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.savedPolicies.includes(policyId)) {
      user.savedPolicies.push(policyId);
      await user.save();
    }
    res.status(200).json({ success: true, message: "Policy saved successfully", savedPolicies: user.savedPolicies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsavePolicy = async (req, res) => {
  try {
    const { policyId } = req.body;
    const user = await User.findById(req.user.id);
    user.savedPolicies = user.savedPolicies.filter((id) => id.toString() !== policyId);
    await user.save();
    res.status(200).json({ success: true, message: "Policy removed from saved", savedPolicies: user.savedPolicies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.savedSchemes.includes(schemeId)) {
      user.savedSchemes.push(schemeId);
      await user.save();
    }
    res.status(200).json({ success: true, message: "Scheme saved successfully", savedSchemes: user.savedSchemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsaveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const user = await User.findById(req.user.id);
    user.savedSchemes = user.savedSchemes.filter((id) => id.toString() !== schemeId);
    await user.save();
    res.status(200).json({ success: true, message: "Scheme removed from saved", savedSchemes: user.savedSchemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavedItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("savedPolicies")
      .populate("savedSchemes");
    res.status(200).json({
      success: true,
      savedPolicies: user.savedPolicies,
      savedSchemes: user.savedSchemes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search History
const getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("searchHistory");
    res.status(200).json({ success: true, searchHistory: user.searchHistory || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addSearchQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query cannot be empty" });
    }
    const user = await User.findById(req.user.id);
    // Keep search history unique and limit to top 10
    const filteredHistory = (user.searchHistory || []).filter((q) => q !== query);
    filteredHistory.unshift(query);
    user.searchHistory = filteredHistory.slice(0, 10);
    await user.save();
    res.status(200).json({ success: true, searchHistory: user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.searchHistory = [];
    await user.save();
    res.status(200).json({ success: true, message: "Search history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
