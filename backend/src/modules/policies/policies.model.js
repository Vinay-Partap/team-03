const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const policySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Healthcare, Education, Agriculture, etc.
    department: { type: String, required: true }, // Finance, Health, Home Affairs, etc.
    state: { type: String, default: "Global" }, // "Global" or state name
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    benefits: { type: String, default: "" },
    applicationProcess: { type: String, default: "" },
    deadline: { type: Date, default: null },
  },
  {
    timestamps: true,
);

policySchema.index({ category: 1 });
policySchema.index({ department: 1 });
policySchema.index({ state: 1 });
policySchema.index({ status: 1 });
policySchema.index({ createdAt: -1 });


module.exports = mongoose.models.Policies || mongoose.model("Policies", policySchema);
