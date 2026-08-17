const analyticsRepository = require("./analytics.repository");

class AnalyticsService {
  async trackView(targetId, targetType) {
    return await analyticsRepository.trackView(targetId, targetType);
  }

  async getViews(targetId) {
    return await analyticsRepository.getViews(targetId);
  }

  async getTopViews() {
    return await analyticsRepository.getAllViews();
  }
}

module.exports = new AnalyticsService();
