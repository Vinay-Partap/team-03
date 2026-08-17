const validateAdminSettings = (req, res, next) => {
  const { allowedDomain } = req.body;
  if (allowedDomain && typeof allowedDomain !== "string") {
    return res.status(400).json({ success: false, message: "Allowed domain must be a string" });
  }
  next();
};

module.exports = {
  validateAdminSettings,
};
