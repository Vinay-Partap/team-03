const validateReportRequest = (req, res, next) => {
  const { type } = req.query;
  if (type && !["policies", "schemes"].includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid report type specified" });
  }
  next();
};

module.exports = {
  validateReportRequest,
};
