const validateRoleUpdate = (req, res, next) => {
  const { role, userId } = req.body;
  if (!role || !userId) {
    return res.status(400).json({ success: false, message: "role and userId are required" });
  }
  if (!["admin", "official", "citizen", "researcher", "organization", "guest"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role specified" });
  }
  next();
};

const validateBookmark = (req, res, next) => {
  const { policyId, schemeId } = req.body;
  if (!policyId && !schemeId) {
    return res.status(400).json({ success: false, message: "policyId or schemeId is required" });
  }
  next();
};

module.exports = {
  validateRoleUpdate,
  validateBookmark,
};
