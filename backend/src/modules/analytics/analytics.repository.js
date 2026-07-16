const Analytics = require("./analytics.model");

class AnalyticsRepository {
  async trackView(targetId, targetType) {
    return await Analytics.findOneAndUpdate(
      { targetId, targetType },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    );
  }

  async getViews(targetId) {
    const record = await Analytics.findOne({ targetId });
    return record ? record.views : 0;
  }

  async getAllViews() {
    return await Analytics.find().sort({ views: -1 });
  }
}

module.exports = new AnalyticsRepository();
