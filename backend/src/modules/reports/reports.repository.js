const User = require("../users/users.model");
const Policy = require("../policies/policies.model");
const Scheme = require("../schemes/schemes.model");
const Reports = require("./reports.model");

class ReportsRepository {
  async getAggregates() {
    const totalUsers = await User.countDocuments();
    const totalPolicies = await Policy.countDocuments();
    const totalSchemes = await Scheme.countDocuments();

    const policiesByDept = await Policy.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const schemesByDept = await Scheme.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const schemesByCat = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const usersByGender = await User.aggregate([
      { $group: { _id: "$profile.gender", count: { $sum: 1 } } },
    ]);

    return {
      summary: { totalUsers, totalPolicies, totalSchemes },
      policiesByDept,
      schemesByDept,
      schemesByCat,
      usersByGender,
    };
  }

  async getPolicies() {
    return await Policy.find();
  }

  async getSchemes() {
    return await Scheme.find();
  }

  async createDownloadLog(logData) {
    return await Reports.create(logData);
  }
}

module.exports = new ReportsRepository();
