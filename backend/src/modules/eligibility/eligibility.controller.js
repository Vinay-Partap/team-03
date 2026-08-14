const eligibilityService = require("./eligibility.service");

const checkEligibility = async (req, res) => {
  try {
    const profile = req.body;
    const results = await eligibilityService.checkEligibility(profile, req.user);
    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHistory=async(req,res)=>{try{res.json({success:true,history:await eligibilityService.getHistory(req.user.id)});}catch(e){res.status(500).json({success:false,message:e.message});}};
const clearHistory=async(req,res)=>{try{await eligibilityService.clearHistory(req.user.id);res.json({success:true});}catch(e){res.status(500).json({success:false,message:e.message});}};

const checkMyEligibility = async (req, res) => {
  try {
    if (!req.user || !req.user.profile) {
      return res.status(400).json({ success: false, message: "User profile details not found" });
    }
    const results = await eligibilityService.checkEligibility(req.user.profile, req.user);
    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkEligibility,
  checkMyEligibility,
  getHistory,
  clearHistory,
};
