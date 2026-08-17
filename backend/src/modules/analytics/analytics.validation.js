const validateTrack = (req, res, next) => {
  const { targetType } = req.body;
  if (targetType && !["policy", "scheme"].includes(targetType)) {
    return res.status(400).json({ success: false, message: "Invalid target type" });
  }
  next();
};

module.exports = {
  validateTrack,
};
