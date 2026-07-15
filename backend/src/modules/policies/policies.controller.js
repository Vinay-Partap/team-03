const Policy = require("./policies.model");
const { logAction } = require("../auditLogs/auditLogs.service");
const Notification = require("../notifications/notifications.model");

// Public & Citizen Search
const getPolicies = async (req, res) => {
  try {
    const { category, department, state, search, status } = req.query;

    let query = {};

    // Citizens & Guests see approved policies only.
    // Officials & Admins can filter by status or view all.
    if (req.user && ["admin", "official"].includes(req.user.role)) {
      if (status) {
        query.status = status;
      }
    } else {
      query.status = "approved";
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (state) {
      if (state.toLowerCase() === "global") {
        query.state = "Global";
      } else {
        query.state = state;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const policies = await Policy.find(query)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    res.status(200).json({ success: true, policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    // Citizens cannot view draft or archived policies directly unless they created them (if official)
    if (policy.status !== "approved") {
      if (!req.user || !["admin", "official"].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Unauthorized to view this policy details" });
      }
    }

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Official & Admin CRUD
const createPolicy = async (req, res) => {
  try {
    const { title, description, category, department, state, benefits, applicationProcess, deadline, status } = req.body;

    const policy = await Policy.create({
      title,
      description,
      category,
      department,
      state: state || "Global",
      benefits,
      applicationProcess,
      deadline,
      status: status || "draft",
      createdBy: req.user.id,
    });

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
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    let policy = await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    // Edit permission check: creator, other official, or admin
    if (policy.createdBy.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "official") {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this policy" });
    }

    const updates = req.body;
    policy = await Policy.findByIdAndUpdate(id, updates, { new: true });

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
    const policy = await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    if (policy.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this policy" });
    }

    await Policy.findByIdAndDelete(id);

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

// Workflow Approvals
const submitPolicyForApproval = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });

    policy.status = "pending_approval";
    await policy.save();

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
    res.status(500).json({ success: false, message: error.message });
  }
};

const approvePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });

    policy.status = "approved";
    policy.approvedBy = req.user.id;
    await policy.save();

    await logAction({
      action: "POLICY_APPROVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Approved and published policy: ${policy.title}`,
      targetId: policy._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    // Send notification about new policy
    await Notification.create({
      userId: null, // Global
      title: "New Policy Launched",
      message: `A new policy '${policy.title}' has been introduced under the ${policy.department} department.`,
      type: "new_policy",
    });

    res.status(200).json({ success: true, message: "Policy approved and published", policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });

    policy.status = "draft";
    await policy.save();

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
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });

    policy.status = "archived";
    await policy.save();

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
  updatePolicy,
  deletePolicy,
  submitPolicyForApproval,
  approvePolicy,
  rejectPolicy,
  archivePolicy,
};
