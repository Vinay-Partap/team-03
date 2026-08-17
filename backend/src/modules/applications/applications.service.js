const applicationsRepository = require("./applications.repository");

class ApplicationsService {
  async submitApplication(userId, schemeId) {
    const existing = await applicationsRepository.find({ userId, schemeId });
    if (existing.length > 0) {
      throw new Error("You have already applied for this scheme");
    }
    return await applicationsRepository.create({ userId, schemeId });
  }

  async getApplications(filter) {
    return await applicationsRepository.find(filter);
  }

  async updateStatus(id, status, remarks = "") {
    const application = await applicationsRepository.findById(id);
    if (!application) {
      throw new Error("Application not found");
    }
    application.status = status;
    application.remarks = remarks;
    return await applicationsRepository.save(application);
  }
}

module.exports = new ApplicationsService();
