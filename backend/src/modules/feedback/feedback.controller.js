const Feedback = require("./feedback.model");
const { logAction } = require("../auditLogs/auditLogs.service");

const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const userId = req.user ? req.user.id : null;

    const feedback = await Feedback.create({
      userId,
      name,
      email,
      subject,
      message,
      type: type || "feedback",
    });

    await logAction({
      action: "FEEDBACK_SUBMIT",
      userId,
      userRole: req.user ? req.user.role : "guest",
      details: `Submitted contact/feedback: ${subject}`,
      targetId: feedback._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    feedback.status = "resolved";
    await feedback.save();

    await logAction({
      action: "FEEDBACK_RESOLVE",
      userId: req.user.id,
      userRole: req.user.role,
      details: `Resolved feedback item: ${feedback.subject}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Feedback marked as resolved", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  resolveFeedback,
};
