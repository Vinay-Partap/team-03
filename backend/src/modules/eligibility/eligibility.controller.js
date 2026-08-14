const eligibilityService = require("./eligibility.service");

const checkEligibility = async (req, res) => {
  try {
    const profile = req.body;
    if (!Number.isFinite(Number(profile.age)) || Number(profile.age) < 0 || Number(profile.age) > 120) return res.status(400).json({success:false,message:"Age must be between 0 and 120"});
    if (!Number.isFinite(Number(profile.income)) || Number(profile.income) < 0) return res.status(400).json({success:false,message:"Income must be a non-negative number"});
    if (!["Male","Female","Transgender"].includes(profile.gender)) return res.status(400).json({success:false,message:"Invalid gender"});
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
