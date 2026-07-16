const User = require("../users/users.model");
const Policy = require("../policies/policies.model");
const Scheme = require("../schemes/schemes.model");
const AuditLog = require("../auditLogs/auditLogs.model");
const Notification = require("../notifications/notifications.model");
const Feedback = require("../feedback/feedback.model");

class DashboardRepository {
  async getUserById(id) {
    return await User.findById(id);
  }

  async getApprovedSchemes() {
    return await Scheme.find({ status: "approved" });
  }

  async getRecentNotifications(userId) {
    return await Notification.find({
      $or: [{ userId }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  async getGovStats() {
    const totalPolicies = await Policy.countDocuments();
    const approvedPolicies = await Policy.countDocuments({ status: "approved" });
    const pendingPolicies = await Policy.countDocuments({ status: "pending_approval" });
    const draftPolicies = await Policy.countDocuments({ status: "draft" });

    const totalSchemes = await Scheme.countDocuments();
    const approvedSchemes = await Scheme.countDocuments({ status: "approved" });
    const pendingSchemes = await Scheme.countDocuments({ status: "pending_approval" });
    const draftSchemes = await Scheme.countDocuments({ status: "draft" });

    const policyCategories = await Policy.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const schemeCategories = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return {
      policies: { total: totalPolicies, approved: approvedPolicies, pending: pendingPolicies, draft: draftPolicies },
      schemes: { total: totalSchemes, approved: approvedSchemes, pending: pendingSchemes, draft: draftSchemes },
      breakdowns: { policyCategories, schemeCategories },
    };
  }

  async getAdminStats() {
    const totalUsers = await User.countDocuments();
    const adminsCount = await User.countDocuments({ role: "admin" });
    const officialsCount = await User.countDocuments({ role: "official" });
    const citizensCount = await User.countDocuments({ role: "citizen" });

    const totalPolicies = await Policy.countDocuments();
    const totalSchemes = await Scheme.countDocuments();

    const feedbacksCount = await Feedback.countDocuments();
    const unresolvedFeedbacks = await Feedback.countDocuments({ status: "open" });

    const recentLogs = await AuditLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      users: { total: totalUsers, admin: adminsCount, official: officialsCount, citizen: citizensCount },
      system: { policies: totalPolicies, schemes: totalSchemes, feedbacks: feedbacksCount, openIssues: unresolvedFeedbacks },
      recentLogs,
    };
  }
}

module.exports = new DashboardRepository();
