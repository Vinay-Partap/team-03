const validateNotificationInput = (req, res, next) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: "Title and message are required" });
  }
  next();
};

module.exports = {
  validateNotificationInput,
};
