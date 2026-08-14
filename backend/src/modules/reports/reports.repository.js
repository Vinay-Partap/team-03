const User = require("../users/users.model");
const Policy = require("../policies/policies.model");
const Scheme = require("../schemes/schemes.model");
const AuditLog = require("../auditLogs/auditLogs.model");
const Application = require("../applications/applications.model");
const Notification = require("../notifications/notifications.model");
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

  async getPolicies(scope = {}) {
    return await Policy.find(scope);
  }

  async getSchemes(scope = {}) {
    return await Scheme.find(scope);
  }

  async getActivity(scope = {}) { return AuditLog.find(scope).populate("userId","name email role").sort({createdAt:-1}).limit(1000); }
  async getDepartmentSummary(scope = {}) { const [policies,schemes,applications,notifications] = await Promise.all([Policy.aggregate([{$match:scope},{$group:{_id:"$department",count:{$sum:1}}}]),Scheme.aggregate([{$match:scope},{$group:{_id:"$department",count:{$sum:1}}}]),Application.countDocuments(),Notification.countDocuments()]); return {policies,schemes,applications,notifications}; }
  async createDownloadLog(logData) {
    return await Reports.create(logData);
  }
}

module.exports = new ReportsRepository();
