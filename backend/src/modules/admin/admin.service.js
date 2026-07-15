const adminRepository = require("./admin.repository");

class AdminService {
  async getSettings() {
    return await adminRepository.getSettings();
  }

  async updateSettings(settingsData) {
    return await adminRepository.updateSettings(settingsData);
  }
}

module.exports = new AdminService();
