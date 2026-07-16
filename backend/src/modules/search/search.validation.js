const validateSearch = (req, res, next) => {
  const { query } = req.body;
  if (query && typeof query !== "string") {
    return res.status(400).json({ success: false, message: "Search query must be a string" });
  }
  next();
};

module.exports = {
  validateSearch,
};
