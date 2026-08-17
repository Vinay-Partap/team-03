const mongoose = require("mongoose");
// Re-use the unified User model
module.exports = mongoose.models.User || require("../users/users.model");
