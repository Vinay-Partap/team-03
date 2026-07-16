const User = require("./users.model");

class UsersRepository {
  async findAll() {
    return await User.find().select("-password");
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByIdAndDelete(id) {
    return await User.findByIdAndDelete(id);
  }

  async save(user) {
    return await user.save();
  }
}

module.exports = new UsersRepository();
