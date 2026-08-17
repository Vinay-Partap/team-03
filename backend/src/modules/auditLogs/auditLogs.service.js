const auditLogsRepository = require("./auditLogs.repository");

class AuditLogsService {
  async logAction({ action, userId, userRole, details, targetId, ipAddress }) {
    try {
      await auditLogsRepository.create({
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
  }

  async getAuditLogs() {
    return await auditLogsRepository.find();
  }
}

module.exports = new AuditLogsService();
