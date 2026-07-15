const AuditLog = require("./auditLogs.model");

const logAction = async ({ action, userId, userRole, details, targetId, ipAddress }) => {
  try {
    await AuditLog.create({
      action,
      userId,
      userRole,
      details,
      targetId,
      ipAddress,
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

module.exports = {
  logAction,
};
