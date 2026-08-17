const validateApplication = (req, res, next) => {
  const { schemeId } = req.body;
  if (!schemeId) {
    return res.status(400).json({ success: false, message: "Scheme ID is required" });
  }
  next();
};

module.exports = {
  validateApplication,
};
