const { deliver } = require("../../services/notification.service");
const applicationsService = require("./applications.service");

const submitApplication = async (req, res) => {
  try {
    const { schemeId } = req.body;
    if (!schemeId) return res.status(400).json({ success: false, message: "Scheme ID is required" });

    const application = await applicationsService.submitApplication(req.user.id, schemeId);
    await deliver({userId:req.user.id,title:"Application Submitted",message:"Your scheme application was submitted.",type:"application_submitted",category:"applications",link:"/dashboard"});
    res.status(201).json({ success: true, message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const query = req.user.role === "admin" || req.user.role === "official" ? {} : { userId: req.user.id };
    const applications = await applicationsService.getApplications(query);
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    if (!["applied", "under_review", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status specified" });
    }
    const application = await applicationsService.updateStatus(id, status, remarks);
    await deliver({userId:application.userId,title:`Application ${status.replace("_"," ")}`,message:remarks||"Your application status has been updated.",type:`application_${status}`,category:"applications",priority:["approved","rejected"].includes(status)?"high":"normal",link:"/dashboard"});
    res.status(200).json({ success: true, message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus,
};
