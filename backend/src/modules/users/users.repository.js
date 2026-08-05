const User = require("./users.model");

class UsersRepository {
  async findAll() {
    return await User.find().select("-password");
  }

  findById(id) {
    console.log("[usersRepository.findById] creating Mongoose Query", { id });
    return User.findById(id);
  }

  findByIdWithSavedItems(id) {
    console.log("[usersRepository.findByIdWithSavedItems] creating populated Query", { id, paths: ["savedPolicies", "savedSchemes"] });
    return User.findById(id).populate("savedPolicies").populate("savedSchemes");
  }

  async findByIdAndDelete(id) {
    return await User.findByIdAndDelete(id);
  }

  async save(user) {
    return await user.save();
  }
}

module.exports = new UsersRepository();
