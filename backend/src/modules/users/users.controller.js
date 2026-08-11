const usersService = require("./users.service");
const { logAction } = require("../auditLogs/auditLogs.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
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

    const oldUser = await usersService.getAllUsers().then(users => users.find(u => u._id.toString() === userId));
    const oldRole = oldUser ? oldUser.role : "citizen";

    const user = await usersService.updateUserRole(userId, role);

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


const updateAccountStatus = async (req, res) => {
  try { const { status, reason } = req.body; if (!['active','suspended','pending_verification','disabled'].includes(status)) return res.status(400).json({success:false,message:'Invalid account status'}); const user = await usersService.updateAccountStatus(req.params.id, status, reason, req.user.id); await logAction({ action:'ADMIN_UPDATE_ACCOUNT_STATUS', userId:req.user._id, userRole:req.user.role, targetId:user._id, details:`Set ${user.email} to ${status}`, ipAddress:req.ip }); res.json({success:true,user}); }
  catch (error) { res.status(error.message.includes('last active') ? 409 : 400).json({success:false,message:error.message}); }
};

const getAccountStatusHistory = async (req,res) => { try { const history = await usersService.getAccountStatusHistory(req.params.id); res.json({success:true,history}); } catch(e) { res.status(500).json({success:false,message:e.message}); } };

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.deleteUser(id);

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

const savePolicy = async (req, res) => {
  try {
    const { policyId } = req.body;
    const savedPolicies = await usersService.savePolicy(req.user.id, policyId);
    res.status(200).json({ success: true, message: "Policy saved successfully", savedPolicies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsavePolicy = async (req, res) => {
  try {
    const { policyId } = req.body;
    const savedPolicies = await usersService.unsavePolicy(req.user.id, policyId);
    res.status(200).json({ success: true, message: "Policy removed from saved", savedPolicies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const savedSchemes = await usersService.saveScheme(req.user.id, schemeId);
    res.status(200).json({ success: true, message: "Scheme saved successfully", savedSchemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsaveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const savedSchemes = await usersService.unsaveScheme(req.user.id, schemeId);
    res.status(200).json({ success: true, message: "Scheme removed from saved", savedSchemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavedItems = async (req, res) => {
  console.log("[GET /api/users/saved] request received");
  console.log("[GET /api/users/saved] req.user", req.user);
  console.log("[GET /api/users/saved] userId", req.user?.id);
  try {
    const savedItems = await usersService.getSavedItems(req.user?.id);
    console.log("[GET /api/users/saved] sending HTTP 200");
    return res.status(200).json({ success: true, ...savedItems });
  } catch (error) {
    console.error("[GET /api/users/saved] exception", error);
    console.error(error.stack);
    return res.status(error.message === "User not found" ? 404 : 500).json({ success: false, message: `Unable to load saved items: ${error.message}` });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const searchHistory = await usersService.getSearchHistory(req.user.id);
    res.status(200).json({ success: true, searchHistory });
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
    const searchHistory = await usersService.addSearchQuery(req.user.id, query);
    res.status(200).json({ success: true, searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    await usersService.clearSearchHistory(req.user.id);
    res.status(200).json({ success: true, message: "Search history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
  getSearchHistory,
  addSearchQuery,
  clearSearchHistory,
};
