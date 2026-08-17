const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true }, // e.g., "LOGIN", "REGISTER", "CREATE_POLICY", "UPDATE_SCHEME", "DELETE_POLICY"
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userRole: { type: String, default: "guest" },
    details: { type: String, default: "" },
    targetId: { type: Schema.Types.ObjectId, default: null },
    ipAddress: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only log creation time
  }
);

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
