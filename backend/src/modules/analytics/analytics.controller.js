const analyticsService = require("./analytics.service");

const trackView = async (req, res) => {
  try {
    const { targetId, targetType } = req.body;
    if (!targetId || !targetType) {
      return res.status(400).json({ success: false, message: "Target ID and Type are required" });
    }
    const stat = await analyticsService.trackView(targetId, targetType);
    res.status(200).json({ success: true, stat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getViews = async (req, res) => {
  try {
    const views = await analyticsService.getViews(req.params.targetId);
    res.status(200).json({ success: true, views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  trackView,
  getViews,
};
