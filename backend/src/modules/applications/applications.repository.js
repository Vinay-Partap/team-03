const Application = require("./applications.model");

class ApplicationsRepository {
  async create(appData) {
    return await Application.create(appData);
  }

  async find(query) {
    return await Application.find(query)
      .populate("userId", "name email profile")
      .populate("schemeId", "title category department");
  }

  async findById(id) {
    return await Application.findById(id)
      .populate("userId", "name email profile")
      .populate("schemeId", "title category department");
  }

  async save(application) {
    return await application.save();
  }
}

module.exports = new ApplicationsRepository();
