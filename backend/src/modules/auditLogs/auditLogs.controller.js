const auditLogsService = require("./auditLogs.service");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await auditLogsService.getAuditLogs();
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAuditLogs,
};
