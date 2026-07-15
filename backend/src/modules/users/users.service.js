const usersRepository = require("./users.repository");

class UsersService {
  async getAllUsers() {
    return await usersRepository.findAll();
  }

  async updateUserRole(userId, role) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.role = role;
    return await usersRepository.save(user);
  }

  async deleteUser(id) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await usersRepository.findByIdAndDelete(id);
    return user;
  }

  async savePolicy(userId, policyId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.savedPolicies.includes(policyId)) {
      user.savedPolicies.push(policyId);
      await usersRepository.save(user);
    }
    return user.savedPolicies;
  }

  async unsavePolicy(userId, policyId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.savedPolicies = user.savedPolicies.filter((id) => id.toString() !== policyId);
    await usersRepository.save(user);
    return user.savedPolicies;
  }

  async saveScheme(userId, schemeId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.savedSchemes.includes(schemeId)) {
      user.savedSchemes.push(schemeId);
      await usersRepository.save(user);
    }
    return user.savedSchemes;
  }

  async unsaveScheme(userId, schemeId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.savedSchemes = user.savedSchemes.filter((id) => id.toString() !== schemeId);
    await usersRepository.save(user);
    return user.savedSchemes;
  }

  async getSavedItems(userId) {
    const user = await usersRepository.findById(userId)
      .populate("savedPolicies")
      .populate("savedSchemes");
    if (!user) {
      throw new Error("User not found");
    }
    return {
      savedPolicies: user.savedPolicies,
      savedSchemes: user.savedSchemes,
    };
  }

  async getSearchHistory(userId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.searchHistory || [];
  }

  async addSearchQuery(userId, query) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const filteredHistory = (user.searchHistory || []).filter((q) => q !== query);
    filteredHistory.unshift(query);
    user.searchHistory = filteredHistory.slice(0, 10);
    await usersRepository.save(user);
    return user.searchHistory;
  }

  async clearSearchHistory(userId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.searchHistory = [];
    return await usersRepository.save(user);
  }
}

module.exports = new UsersService();
