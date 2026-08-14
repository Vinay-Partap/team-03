const policiesRepository = require("./policies.repository");
const Notification = require("../notifications/notifications.model");

class PoliciesService {
  async getPolicies(filter, user) {
    const { category, department, state, ministry, publicationFrom, publicationTo, effectiveFrom, effectiveTo, deadlineFrom, deadlineTo, sector, sort, search, status, page, limit } = filter;
    let query = {};

    if (user?.role === "admin") {
      if (status) query.status = status;
    } else if (user?.role === "official") {
      const ownOrDepartment = [{ createdBy: user._id }];
      if (user.department) ownOrDepartment.push({ department: user.department, status: "pending_approval" });
      query.$and = [{ $or: [{ status: "approved" }, ...ownOrDepartment] }];
      if (status) query.$and.push({ status });
    } else {
      query.status = "approved";
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (ministry) query.ministry = ministry;
    if (sector) query.sector = sector;
    if (publicationFrom || publicationTo) query.publicationDate = { ...(publicationFrom && {$gte:new Date(publicationFrom)}), ...(publicationTo && {$lte:new Date(publicationTo)}) };
    if (deadlineFrom || deadlineTo) query.deadline={...(deadlineFrom&&{$gte:new Date(deadlineFrom)}),...(deadlineTo&&{$lte:new Date(deadlineTo)})};
    if (effectiveFrom || effectiveTo) query.effectiveDate = { ...(effectiveFrom && {$gte:new Date(effectiveFrom)}), ...(effectiveTo && {$lte:new Date(effectiveTo)}) };
    if (state) {
      if (state.toLowerCase() === "global") {
        query.state = "Global";
      } else {
        query.state = state;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        { description: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      ];
    }

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
    const maxLimit = limit ? Math.min(Number(limit), 100) : 25;

    const sortMap={newest:{createdAt:-1},oldest:{createdAt:1},updated:{updatedAt:-1},deadline:{deadline:1}}; const [policies, total] = await Promise.all([policiesRepository.find(query, skip, maxLimit, sortMap[sort] || sortMap.newest), policiesRepository.count(query)]);
    return { items: policies, pagination: { page: Number(page) || 1, limit: maxLimit, total, totalPages: Math.ceil(total / maxLimit) } };
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

  async createPolicy(policyData, user) {
    const department = user.role === "official" ? user.department : policyData.department;
    if (!department) throw new Error("Government Officials must have an assigned department before creating content");
    return await policiesRepository.create({
      ...policyData,
      department,
      createdBy: user.id,
    });
  }

  async updatePolicy(id, updateData, user) {
    const policy = await policiesRepository.findById(id);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const creatorId = policy.createdBy?._id || policy.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to edit this policy");
    }

    policy.version = (policy.version || 1) + 1;
    policy.versionHistory.push({ version: policy.version, changedAt: new Date(), changedBy: user.id, summary: updateData.changeSummary || "Policy updated" });
    Object.assign(policy, updateData); delete policy.changeSummary;
    return await policiesRepository.save(policy);
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

  async attachDocument(id, file, user) { const policy=await policiesRepository.findById(id); if(!policy) throw new Error("Policy not found"); const creator=policy.createdBy?._id||policy.createdBy; if(user.role!=="admin"&&creator.toString()!==user.id) throw new Error("Unauthorized to upload policy document"); policy.document={ key:file.filename, name:file.originalname, mimeType:file.mimetype, size:file.size, uploadedAt:new Date(), uploadedBy:user.id }; return policiesRepository.save(policy); }

  async submitForApproval(id, user) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");
    const creatorId = policy.createdBy?._id || policy.createdBy;
    console.log("[policy-submit] ownership check", { policyId: id, creatorId: creatorId?.toString(), requesterId: user?.id, status: policy.status });
    if (!creatorId || (creatorId.toString() !== user.id && user.role !== "admin")) throw new Error("Only the creator can submit this record");
    if (policy.status !== "draft") throw new Error("Only drafts can be submitted");
    policy.status = "pending_approval";
    return await policiesRepository.save(policy);
  }

  async approvePolicy(id, reviewer) {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");
    if (reviewer.role === "official" && reviewer.department !== policy.department) throw new Error("Officials may only review records in their assigned department");
    if (policy.status !== "pending_approval") throw new Error("Only submitted records can be approved");
    if (policy.createdBy?._id?.toString() === reviewer.id.toString() || policy.createdBy?.toString() === reviewer.id.toString()) throw new Error("A creator cannot approve their own policy");
    policy.status = "approved";
    policy.approvedBy = reviewer.id;
    policy.reviewedBy = reviewer.id; policy.reviewedAt = new Date(); policy.reviewDecision = "approved"; policy.reviewReason = "";
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

  async rejectPolicy(id, reviewer, reason = "") {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");
    if (reviewer.role === "official" && reviewer.department !== policy.department) throw new Error("Officials may only review records in their assigned department");
    if (policy.status !== "pending_approval") throw new Error("Only submitted records can be rejected");
    const creatorId = policy.createdBy?._id || policy.createdBy;
    if (!creatorId || creatorId.toString() === reviewer.id.toString()) throw new Error("A creator cannot reject their own policy");
    policy.status = "draft"; policy.reviewedBy = reviewer.id; policy.reviewedAt = new Date(); policy.reviewDecision = "rejected"; policy.reviewReason = reason;
    return await policiesRepository.save(policy);
  }

  async restorePolicy(id, user) { const policy = await policiesRepository.findById(id); if (!policy) throw new Error("Policy not found"); if (user.role !== "admin" && (policy.createdBy?._id || policy.createdBy).toString() !== user.id) throw new Error("Unauthorized to restore this policy"); if (policy.status !== "archived") throw new Error("Only archived policies can be restored"); policy.status = "draft"; policy.archivedAt = null; policy.archivedBy = null; policy.archiveReason = ""; return policiesRepository.save(policy); }

  async archivePolicy(id, user, reason = "") {
    const policy = await policiesRepository.findById(id);
    if (!policy) throw new Error("Policy not found");

    policy.status = "archived"; policy.archivedAt = new Date(); policy.archivedBy = user.id; policy.archiveReason = reason;
    return await policiesRepository.save(policy);
  }
}

module.exports = new PoliciesService();
