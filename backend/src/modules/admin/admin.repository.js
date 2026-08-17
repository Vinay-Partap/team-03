const Admin = require("./admin.model");

class AdminRepository {
  async getSettings() {
    let settings = await Admin.findOne();
    if (!settings) {
      settings = await Admin.create({ maintenanceMode: false, allowedDomain: "*" });
    }
    return settings;
  }

  async updateSettings(settingsData) {
    const settings = await this.getSettings();
    settings.maintenanceMode = settingsData.maintenanceMode !== undefined ? settingsData.maintenanceMode : settings.maintenanceMode;
    settings.allowedDomain = settingsData.allowedDomain || settings.allowedDomain;
    return await settings.save();
  }
}

module.exports = new AdminRepository();
