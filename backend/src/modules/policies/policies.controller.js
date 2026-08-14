const policiesService = require("./policies.service");
const path = require("path");
const { logAction } = require("../auditLogs/auditLogs.service");

const getPolicies = async (req, res) => {
  try {
    const policies = await policiesService.getPolicies(req.query, req.user);
    res.status(200).json({ success: true, policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await policiesService.getPolicyById(req.params.id, req.user);
    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPolicyDocument = async (req,res) => { try { const policy=await policiesService.getPolicyById(req.params.id, req.user); if(!policy.document?.key) return res.status(404).json({success:false,message:"No document attached"}); res.download(path.join(process.cwd(),"uploads","policies",policy.document.key), policy.document.name); } catch(e) { res.status(e.message.includes("Unauthorized")?403:404).json({success:false,message:e.message}); } };

const createPolicy = async (req, res) => {
  try {
    const policy = await policiesService.createPolicy(req.body, req.user);

    await logAction({
      action: "POLICY_CREATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Created policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, policy });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await policiesService.updatePolicy(id, req.body, req.user);

    await logAction({
      action: "POLICY_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Updated policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await policiesService.deletePolicy(id, req.user);

    await logAction({
      action: "POLICY_DELETE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Deleted policy: ${policy.title}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadPolicyDocument = async (req,res) => { try { if(!req.file) return res.status(400).json({success:false,message:"A policy document is required"}); const policy=await policiesService.attachDocument(req.params.id,req.file,req.user); res.json({success:true,policy}); } catch(e) { res.status(400).json({success:false,message:e.message}); } };

const submitPolicyForApproval = async (req, res) => {
  try {
    const policy = await policiesService.submitForApproval(req.params.id, req.user);

    await logAction({
      action: "POLICY_SUBMIT_APPROVAL",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Submitted policy for approval: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy submitted for approval", policy });
  } catch (error) {
    console.error("[PUT /api/policies/:id/submit]", error);
    const status = error.message === "Policy not found" ? 404 : (error.message.includes("creator") || error.message.includes("draft") ? 403 : 500);
    res.status(status).json({ success: false, message: error.message });
  }
};

const approvePolicy = async (req, res) => {
  try {
    const policy = await policiesService.approvePolicy(req.params.id, req.user);

    await logAction({
      action: "POLICY_APPROVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Approved and published policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy approved and published", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectPolicy = async (req, res) => {
  try {
    const policy = await policiesService.rejectPolicy(req.params.id, req.user, req.body.reason);

    await logAction({
      action: "POLICY_REJECT",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Rejected policy (sent back to draft): ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy rejected and returned to drafts", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const archivePolicy = async (req, res) => {
  try {
    const policy = await policiesService.archivePolicy(req.params.id, req.user, req.body.reason);

    await logAction({
      action: "POLICY_ARCHIVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Archived policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Policy archived successfully", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  getPolicyDocument,
  updatePolicy,
  deletePolicy,
  submitPolicyForApproval,
  uploadPolicyDocument,
  approvePolicy,
  rejectPolicy,
  archivePolicy,
};
