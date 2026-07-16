const AuditLog = require("./auditLogs.model");

class AuditLogsRepository {
  async create(logData) {
    return await AuditLog.create(logData);
  }

  async find() {
    return await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
  }
}

module.exports = new AuditLogsRepository();
