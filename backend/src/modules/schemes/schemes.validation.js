const validateSchemeInput = (req, res, next) => {
  const { title, description, category, department } = req.body;
  if (!title || !description || !category || !department) {
    return res.status(400).json({
      success: false,
      message: "Title, description, category, and department are required fields",
    });
  }
  next();
};

module.exports = {
  validateSchemeInput,
};
