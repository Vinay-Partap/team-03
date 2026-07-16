const eligibilityService = require("./eligibility.service");

const checkEligibility = async (req, res) => {
  try {
    const profile = req.body;
    const results = await eligibilityService.checkEligibility(profile, req.user ? req.user.id : null);
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkMyEligibility = async (req, res) => {
  try {
    if (!req.user || !req.user.profile) {
      return res.status(400).json({ success: false, message: "User profile details not found" });
    }
    const results = await eligibilityService.checkEligibility(req.user.profile, req.user.id);
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkEligibility,
  checkMyEligibility,
};
