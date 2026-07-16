const dashboardService = require("./dashboard.service");

const getCitizenDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getCitizenDashboard(req.user.id);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGovernmentDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getGovernmentDashboard();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCitizenDashboardData,
  getGovernmentDashboardData,
  getAdminDashboardData,
};
