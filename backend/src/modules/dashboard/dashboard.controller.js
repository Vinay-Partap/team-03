const User = require("../users/users.model");
const Policy = require("../policies/policies.model");
const Scheme = require("../schemes/schemes.model");
const AuditLog = require("../auditLogs/auditLogs.model");
const Notification = require("../notifications/notifications.model");
const Feedback = require("../feedback/feedback.model");

const getCitizenDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Matched Schemes
    const allSchemes = await Scheme.find({ status: "approved" });
    const profile = user.profile || {};
    let matchedCount = 0;

    allSchemes.forEach((scheme) => {
      const rules = scheme.eligibilityRules || {};
      let matches = true;

      // Simple match checker
      if (profile.age && rules.ageMin && profile.age < rules.ageMin) matches = false;
      if (profile.age && rules.ageMax && profile.age > rules.ageMax) matches = false;
      if (profile.gender && rules.gender && rules.gender !== "All" && profile.gender.toLowerCase() !== rules.gender.toLowerCase()) matches = false;
      if (profile.income && rules.incomeMax && profile.income > rules.incomeMax) matches = false;
      if (profile.state && rules.state && rules.state !== "All" && rules.state.toLowerCase() !== "global" && profile.state.toLowerCase() !== rules.state.toLowerCase()) matches = false;

      if (matches) matchedCount++;
    });

    // Recent Notifications
    const notifications = await Notification.find({
      $or: [{ userId: user._id }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        savedPoliciesCount: user.savedPolicies.length,
        savedSchemesCount: user.savedSchemes.length,
        eligibleSchemesCount: matchedCount,
        recentSearchesCount: (user.searchHistory || []).length,
      },
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGovernmentDashboardData = async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    const approvedPolicies = await Policy.countDocuments({ status: "approved" });
    const pendingPolicies = await Policy.countDocuments({ status: "pending_approval" });
    const draftPolicies = await Policy.countDocuments({ status: "draft" });

    const totalSchemes = await Scheme.countDocuments();
    const approvedSchemes = await Scheme.countDocuments({ status: "approved" });
    const pendingSchemes = await Scheme.countDocuments({ status: "pending_approval" });
    const draftSchemes = await Scheme.countDocuments({ status: "draft" });

    // Category breakdown
    const policyCategories = await Policy.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const schemeCategories = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      policies: {
        total: totalPolicies,
        approved: approvedPolicies,
        pending: pendingPolicies,
        draft: draftPolicies,
      },
      schemes: {
        total: totalSchemes,
        approved: approvedSchemes,
        pending: pendingSchemes,
        draft: draftSchemes,
      },
      breakdowns: {
        policyCategories,
        schemeCategories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminDashboardData = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      users: {
        total: totalUsers,
        admin: adminsCount,
        official: officialsCount,
        citizen: citizensCount,
      },
      system: {
        policies: totalPolicies,
        schemes: totalSchemes,
        feedbacks: feedbacksCount,
        openIssues: unresolvedFeedbacks,
      },
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCitizenDashboardData,
  getGovernmentDashboardData,
  getAdminDashboardData,
};
