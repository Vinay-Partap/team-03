const Scheme = require("../schemes/schemes.model");
const Eligibility = require("./eligibility.model");

class EligibilityRepository {
  async getApprovedSchemes() {
    return await Scheme.find({ status: "approved" });
  }

  async saveLog(logData) {
    return await Eligibility.create(logData);
  }
}

module.exports = new EligibilityRepository();
