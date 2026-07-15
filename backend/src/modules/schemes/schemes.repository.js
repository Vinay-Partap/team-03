const Scheme = require("./schemes.model");

class SchemesRepository {
  async find(query) {
    return await Scheme.find(query)
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");
  }

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
