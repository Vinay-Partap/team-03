const searchService = require("./search.service");

const trackSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: "Query text is required" });
    const stat = await searchService.trackQuery(query);
    res.status(200).json({ success: true, stat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrending = async (req, res) => {
  try {
    const trending = await searchService.getTrendingQueries();
    res.status(200).json({ success: true, trending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  trackSearch,
  getTrending,
};
