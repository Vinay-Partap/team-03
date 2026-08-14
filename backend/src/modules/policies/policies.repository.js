const Policy = require("./policies.model");

class PoliciesRepository {
  async find(query, skip = 0, limit = 0) {
    let q = Policy.find(query);
    if (skip > 0) q = q.skip(skip);
    if (limit > 0) q = q.limit(limit);
    return await q
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

  async count(query) { return Policy.countDocuments(query); }

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
