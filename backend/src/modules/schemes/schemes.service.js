const schemesRepository = require("./schemes.repository");
const Notification = require("../notifications/notifications.model");

class SchemesService {
  async getSchemes(filter, user) {
    const { category, department, state, ministry, publicationFrom, publicationTo, effectiveFrom, effectiveTo, sort, search, status, page, limit } = filter;
    let query = {};

    if (user?.role === "admin") { if (status) query.status = status;
    } else if (user?.role === "official") { const scoped=[{createdBy:user._id}]; if(user.department) scoped.push({department:user.department,status:"pending_approval"}); query.$and=[{$or:[{status:"approved"},...scoped]}]; if(status) query.$and.push({status});
    } else {
      query.status = "approved";
    }

    if (category) query.category = category;
    if (department) query.department=department; if (ministry) query.ministry=ministry; if(publicationFrom||publicationTo) query.publicationDate={...(publicationFrom&&{$gte:new Date(publicationFrom)}),...(publicationTo&&{$lte:new Date(publicationTo)})}; if(effectiveFrom||effectiveTo) query.effectiveDate={...(effectiveFrom&&{$gte:new Date(effectiveFrom)}),...(effectiveTo&&{$lte:new Date(effectiveTo)})};
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
        { benefits: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      ];
    }

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
    const maxLimit = limit ? Math.min(Number(limit), 100) : 25;

    const [schemes,total]=await Promise.all([schemesRepository.find(query,skip,maxLimit),schemesRepository.count(query)]); return {items:schemes,pagination:{page:Number(page)||1,limit:maxLimit,total,totalPages:Math.ceil(total/maxLimit)}};
  }

  async getSchemeById(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    if (scheme.status !== "approved") {
      if (!user || !["admin", "official"].includes(user.role)) {
        throw new Error("Unauthorized to view this scheme");
      }
    }

    return scheme;
  }

  async createScheme(schemeData, user) {
    const rules = schemeData.eligibilityRules || {}; if (rules.ageMin != null && rules.ageMax != null && Number(rules.ageMin) > Number(rules.ageMax)) throw new Error("Minimum age cannot exceed maximum age"); if (rules.incomeMax != null && Number(rules.incomeMax) < 0) throw new Error("Income limit cannot be negative");
    const department = user.role === "official" ? user.department : schemeData.department;
    if (!department) throw new Error("Government Officials must have an assigned department before creating content");
    return await schemesRepository.create({
      ...schemeData,
      department,
      createdBy: user.id,
    });
  }

  async updateScheme(id, updateData, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const creatorId = scheme.createdBy?._id || scheme.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to edit this scheme");
    }

    const rules = updateData.eligibilityRules || {}; if (rules.ageMin != null && rules.ageMax != null && Number(rules.ageMin) > Number(rules.ageMax)) throw new Error("Minimum age cannot exceed maximum age");
    if (updateData.updateContent) { scheme.updates.push({ content: updateData.updateContent, date: new Date(), addedBy: user.id, type: updateData.updateType || "General Update" }); delete updateData.updateContent; delete updateData.updateType; }
    scheme.version = (scheme.version || 1) + 1; scheme.versionHistory.push({ version:scheme.version, changedAt:new Date(), changedBy:user.id, summary:updateData.changeSummary || "Scheme updated" }); delete updateData.changeSummary;
    Object.assign(scheme, updateData); return await schemesRepository.save(scheme);
  }

  async deleteScheme(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const creatorId = scheme.createdBy?._id || scheme.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to delete this scheme");
    }

    return await schemesRepository.findByIdAndDelete(id);
  }

  async attachDocument(id,file,user) { const scheme=await schemesRepository.findById(id); if(!scheme) throw new Error("Scheme not found"); const creator=scheme.createdBy?._id||scheme.createdBy; if(user.role!=="admin"&&creator.toString()!==user.id) throw new Error("Unauthorized to upload scheme document"); scheme.document={key:file.filename,name:file.originalname,mimeType:file.mimetype,size:file.size,uploadedAt:new Date(),uploadedBy:user.id}; return schemesRepository.save(scheme); }

  async submitForApproval(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (scheme.createdBy.toString() !== user.id && user.role !== "admin") throw new Error("Only the creator can submit this record");
    if (scheme.status !== "draft") throw new Error("Only drafts can be submitted");
    scheme.status = "pending_approval";
    return await schemesRepository.save(scheme);
  }

  async approveScheme(id, reviewer) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (reviewer.role === "official" && reviewer.department !== scheme.department) throw new Error("Officials may only review records in their assigned department");
    if (scheme.status !== "pending_approval") throw new Error("Only submitted records can be approved");
    if (scheme.createdBy?._id?.toString() === reviewer.id.toString() || scheme.createdBy?.toString() === reviewer.id.toString()) throw new Error("A creator cannot approve their own scheme");
    scheme.status = "approved";
    scheme.approvedBy = reviewer.id;
    scheme.reviewedBy = reviewer.id; scheme.reviewedAt = new Date(); scheme.reviewDecision = "approved"; scheme.reviewReason = "";
    const saved = await schemesRepository.save(scheme);

    // Send global notification
    await Notification.create({
      userId: null,
      title: "New Public Welfare Scheme Live",
      message: `A new public scheme '${scheme.title}' has been launched under the ${scheme.department} department. Check eligibility parameters!`,
      type: "scheme_update",
    });

    return saved;
  }

  async rejectScheme(id, reviewer, reason = "") {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (reviewer.role === "official" && reviewer.department !== scheme.department) throw new Error("Officials may only review records in their assigned department");
    if (scheme.status !== "pending_approval") throw new Error("Only submitted records can be rejected");
    const creatorId = scheme.createdBy?._id || scheme.createdBy;
    if (!creatorId || creatorId.toString() === reviewer.id.toString()) throw new Error("A creator cannot reject their own scheme");
    scheme.status = "draft"; scheme.reviewedBy = reviewer.id; scheme.reviewedAt = new Date(); scheme.reviewDecision = "rejected"; scheme.reviewReason = reason;
    return await schemesRepository.save(scheme);
  }

  async restoreScheme(id,user) { const scheme=await schemesRepository.findById(id); if(!scheme) throw new Error("Scheme not found"); const creator=scheme.createdBy?._id||scheme.createdBy; if(user.role!=="admin"&&creator.toString()!==user.id) throw new Error("Unauthorized to restore this scheme"); if(scheme.status!=="archived") throw new Error("Only archived schemes can be restored"); scheme.status="draft";scheme.archivedAt=null;scheme.archivedBy=null;scheme.archiveReason="";return schemesRepository.save(scheme); }

  async archiveScheme(id,user,reason="") {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");

    scheme.status="archived";scheme.archivedAt=new Date();scheme.archivedBy=user.id;scheme.archiveReason=reason;return schemesRepository.save(scheme);
  }

  async addSchemeUpdate(id, content, user, type = "General Update") {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");

    scheme.updates.push({ content, addedBy:user.id, type }); if(scheme.status === "approved") await Notification.create({userId:null,title:"Scheme Update",message:`${scheme.title}: ${content}`,type:"scheme_update",category:"schemes",link:`/schemes/${scheme._id}`});
    return await schemesRepository.save(scheme);
  }
}

module.exports = new SchemesService();
