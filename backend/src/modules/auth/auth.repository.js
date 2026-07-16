const User = require("../users/users.model");

class AuthRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async saveUser(user) {
    return await user.save();
  }
}

module.exports = new AuthRepository();
