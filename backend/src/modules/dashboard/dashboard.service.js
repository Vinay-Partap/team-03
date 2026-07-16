const dashboardRepository = require("./dashboard.repository");

class DashboardService {
  async getCitizenDashboard(userId) {
    const user = await dashboardRepository.getUserById(userId);
    if (!user) throw new Error("User not found");

    const allSchemes = await dashboardRepository.getApprovedSchemes();
    const profile = user.profile || {};
    let matchedCount = 0;

    allSchemes.forEach((scheme) => {
      const rules = scheme.eligibilityRules || {};
      let matches = true;

      if (profile.age && rules.ageMin && profile.age < rules.ageMin) matches = false;
      if (profile.age && rules.ageMax && profile.age > rules.ageMax) matches = false;
      if (profile.gender && rules.gender && rules.gender !== "All" && profile.gender.toLowerCase() !== rules.gender.toLowerCase()) matches = false;
      if (profile.income && rules.incomeMax && profile.income > rules.incomeMax) matches = false;
      if (profile.state && rules.state && rules.state !== "All" && rules.state.toLowerCase() !== "global" && profile.state.toLowerCase() !== rules.state.toLowerCase()) matches = false;

      if (matches) matchedCount++;
    });

    const notifications = await dashboardRepository.getRecentNotifications(userId);

    return {
      stats: {
        savedPoliciesCount: user.savedPolicies.length,
        savedSchemesCount: user.savedSchemes.length,
        eligibleSchemesCount: matchedCount,
        recentSearchesCount: (user.searchHistory || []).length,
      },
      notifications,
    };
  }

  async getGovernmentDashboard() {
    return await dashboardRepository.getGovStats();
  }

  async getAdminDashboard() {
    return await dashboardRepository.getAdminStats();
  }
}

module.exports = new DashboardService();
