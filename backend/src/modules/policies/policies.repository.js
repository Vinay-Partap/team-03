const Policy = require("./policies.model");

class PoliciesRepository {
  async find(query) {
    return await Policy.find(query)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

  async findById(id) {
    return await Policy.findById(id)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

  async create(policyData) {
    return await Policy.create(policyData);
  }

  async findByIdAndUpdate(id, updateData) {
    return await Policy.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByIdAndDelete(id) {
    return await Policy.findByIdAndDelete(id);
  }

  async save(policy) {
    return await policy.save();
  }
}

module.exports = new PoliciesRepository();
