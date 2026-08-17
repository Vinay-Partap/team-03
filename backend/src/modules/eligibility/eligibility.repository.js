const Scheme = require("../schemes/schemes.model");
const Eligibility = require("./eligibility.model");

class EligibilityRepository {
  async getApprovedSchemes() {
    return await Scheme.find({ status: "approved" });
  }

  async getHistory(userId) { return Eligibility.find({userId}).sort({createdAt:-1}).limit(20); }
  async clearHistory(userId) { return Eligibility.deleteMany({userId}); }

  async saveLog(logData) {
    return await Eligibility.create(logData);
  }
}

module.exports = new EligibilityRepository();
