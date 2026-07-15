const validateEligibilityQuery = (req, res, next) => {
  const profile = req.body;
  if (!profile || Object.keys(profile).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Eligibility criteria query parameters profile is required",
    });
  }
  next();
};

module.exports = {
  validateEligibilityQuery,
};
