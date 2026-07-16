const validateFeedbackInput = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Please fill all required fields" });
  }
  next();
};

module.exports = {
  validateFeedbackInput,
};
