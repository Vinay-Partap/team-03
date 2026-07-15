const Scheme = require("./schemes.model");
const { logAction } = require("../auditLogs/auditLogs.service");
const Notification = require("../notifications/notifications.model");

// Public & Citizen Search
const getSchemes = async (req, res) => {
  try {
    const { category, department, state, search, status } = req.query;

    let query = {};

    // Check permissions
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
        { benefits: { $regex: search, $options: "i" } },
      ];
    }

    const schemes = await Scheme.find(query)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    res.status(200).json({ success: true, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    if (scheme.status !== "approved") {
      if (!req.user || !["admin", "official"].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Unauthorized to view this scheme" });
      }
    }

    res.status(200).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Official & Admin CRUD
const createScheme = async (req, res) => {
  try {
    const { title, description, category, department, state, benefits, applicationProcess, eligibilityRules, status } = req.body;

    const scheme = await Scheme.create({
      title,
      description,
      category,
      department,
      state: state || "Global",
      benefits,
      applicationProcess,
      eligibilityRules: eligibilityRules || {},
      status: status || "draft",
      createdBy: req.user.id,
    });

    await logAction({
      action: "SCHEME_CREATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Created scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    let scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    if (scheme.createdBy.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "official") {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this scheme" });
    }

    const updates = req.body;

    // Track a history log if updates are described
    if (updates.updateContent) {
      if (!scheme.updates) scheme.updates = [];
      scheme.updates.push({
        content: updates.updateContent,
        date: new Date(),
      });
      delete updates.updateContent;
    }

    scheme = await Scheme.findByIdAndUpdate(id, updates, { new: true });

    await logAction({
      action: "SCHEME_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Updated scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    if (scheme.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this scheme" });
    }

    await Scheme.findByIdAndDelete(id);

    await logAction({
      action: "SCHEME_DELETE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Deleted scheme: ${scheme.title}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Workflow Approvals
const submitSchemeForApproval = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });

    scheme.status = "pending_approval";
    await scheme.save();

    await logAction({
      action: "SCHEME_SUBMIT_APPROVAL",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Submitted scheme for approval: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme submitted for approval", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });

    scheme.status = "approved";
    scheme.approvedBy = req.user.id;
    await scheme.save();

    await logAction({
      action: "SCHEME_APPROVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Approved scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    // Send global notification
    await Notification.create({
      userId: null,
      title: "New Public Welfare Scheme Live",
      message: `A new public scheme '${scheme.title}' has been launched under the ${scheme.department} department. Check eligibility parameters!`,
      type: "scheme_update",
    });

    res.status(200).json({ success: true, message: "Scheme approved and published", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });

    scheme.status = "draft";
    await scheme.save();

    await logAction({
      action: "SCHEME_REJECT",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Rejected scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme returned to drafts", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const archiveScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });

    scheme.status = "archived";
    await scheme.save();

    await logAction({
      action: "SCHEME_ARCHIVE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Archived scheme: ${scheme.title}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme archived successfully", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add updates history
const addSchemeUpdate = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "Update content is required" });

    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });

    scheme.updates.push({ content });
    await scheme.save();

    await logAction({
      action: "SCHEME_ADD_UPDATE",
      userId: req.user._id,
      userRole: req.user.role,
      details: `Added updates to scheme ${scheme.title}: ${content}`,
      targetId: scheme._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Scheme update posted", scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  submitSchemeForApproval,
  approveScheme,
  rejectScheme,
  archiveScheme,
  addSchemeUpdate,
};
