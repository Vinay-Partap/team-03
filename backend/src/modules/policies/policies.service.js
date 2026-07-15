const policiesRepository = require("./policies.repository");
const Notification = require("../notifications/notifications.model");

class PoliciesService {
  async getPolicies(filter, user) {
    const { category, department, state, search, status } = filter;
    let query = {};

    if (user && ["admin", "official"].includes(user.role)) {
      if (status) {
        query.status = status;
      }
    } else {
      query.status = "approved";
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (state) {
      if (state.toLowerCase() === "global") {
        query.state = "Global";
      } else {
        query.state = state;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    return await policiesRepository.find(query);
  }

  async getPolicyById(id, user) {
    const policy = await policiesRepository.findById(id);
    if (!policy) {
      throw new Error("Policy not found");
    }

    if (policy.status !== "approved") {
      if (!user || !["admin", "official"].includes(user.role)) {
        throw new Error("Unauthorized to view this policy details");
      }
    }

    return policy;
  }

  async createPolicy(policyData, userId) {
    return await policiesRepository.create({
      ...policyData,
      createdBy: userId,
    });
  }

  async updatePolicy(id, updateData, user) {
    const policy = await policiesRepository.findById(id);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const creatorId = policy.createdBy?._id || policy.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin" && user.role !== "official") {
      throw new Error("Unauthorized to edit this policy");
    }

    return await policiesRepository.findByIdAndUpdate(id, updateData);
  }

  async deletePolicy(id, user) {
    const policy = await policiesRepository.findById(id);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const creatorId = policy.createdBy?._id || policy.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to delete this policy");
    }

    return await policiesRepository.findByIdAndDelete(id);
  }

  async submitForApproval(id) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");

    policy.status = "pending_approval";
    return await policiesRepository.save(policy);
  }

  async approvePolicy(id, approverId) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");

    policy.status = "approved";
    policy.approvedBy = approverId;
    const saved = await policiesRepository.save(policy);

    // Send global notification
    await Notification.create({
      userId: null,
      title: "New Policy Launched",
      message: `A new policy '${policy.title}' has been introduced under the ${policy.department} department.`,
      type: "new_policy",
    });

    return saved;
  }

  async rejectPolicy(id) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");

    policy.status = "draft";
    return await policiesRepository.save(policy);
  }

  async archivePolicy(id) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");

    policy.status = "archived";
    return await policiesRepository.save(policy);
  }
}

module.exports = new PoliciesService();
