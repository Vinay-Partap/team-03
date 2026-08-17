const adminService = require("./admin.service");

const getSettings = async (req, res) => {
  try {
    const settings = await adminService.getSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await adminService.updateSettings(req.body);
    res.status(200).json({ success: true, message: "Admin settings updated", settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
