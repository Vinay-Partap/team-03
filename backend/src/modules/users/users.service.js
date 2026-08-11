const usersRepository = require("./users.repository");
const AccountStatusHistory = require("./accountStatusHistory.model");

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

  async updateAccountStatus(id, status, reason = "", changedBy) {
    const user = await usersRepository.findById(id);
    if (!user) throw new Error("User not found");
    if (["suspended", "disabled"].includes(status) && user.role === "admin" && user.isActive) {
      const count = await usersRepository.countActiveAdmins();
      if (count <= 1) throw new Error("Cannot deactivate the last active administrator");
    }
    const previousStatus = user.accountStatus; user.accountStatus = status; user.statusReason = reason; user.isActive = status === "active";
    if (user.role === "official" && status === "active" && !user.officialProfile.verifiedAt) user.officialProfile.verifiedAt = new Date(); const saved = await usersRepository.save(user); if (changedBy) await AccountStatusHistory.create({ userId: saved._id, previousStatus, newStatus: status, reason, changedBy }); return saved;
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
    console.log("[saved-items] service entered", { userId, userIdType: typeof userId });
    try {
      const query = usersRepository.findByIdWithSavedItems(userId);
      console.log("[saved-items] repository result", { isThenable: typeof query?.then === "function", constructor: query?.constructor?.name });
      const user = await query;
      console.log("[saved-items] populated user document", { found: Boolean(user), savedPolicies: user?.savedPolicies?.length, savedSchemes: user?.savedSchemes?.length });
      if (!user) throw new Error("User not found");
      const result = { savedPolicies: user.savedPolicies || [], savedSchemes: user.savedSchemes || [] };
      console.log("[saved-items] returning", { policies: result.savedPolicies.length, schemes: result.savedSchemes.length });
      return result;
    } catch (error) {
      console.error("[saved-items] populate/query failure", error);
      console.error(error.stack);
      throw error;
    }
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
