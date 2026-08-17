const Scheme = require("./schemes.model");

class SchemesRepository {
  async find(query, skip = 0, limit = 0, sort = { createdAt: -1 }) {
    let q = Scheme.find(query).sort(sort);
    if (skip > 0) q = q.skip(skip);
    if (limit > 0) q = q.limit(limit);
    return await q
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

  async count(query) { return Scheme.countDocuments(query); }

  async findById(id) {
    return await Scheme.findById(id)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

  async create(schemeData) {
    return await Scheme.create(schemeData);
  }

  async findByIdAndUpdate(id, updateData) {
    return await Scheme.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByIdAndDelete(id) {
    return await Scheme.findByIdAndDelete(id);
  }

  async save(scheme) {
    return await scheme.save();
  }
}

module.exports = new SchemesRepository();
