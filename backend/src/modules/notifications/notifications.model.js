const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Null represents global broadcast
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    category: { type: String, enum: ["policies", "schemes", "applications", "system"], default: "system" },
    deletedAt: { type: Date, default: null },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    link: { type: String, default: "" },
    type: {
      type: String,
      enum: ["application_submitted", "application_approved", "application_rejected", "new_scheme", "policy_update", "announcement", "document_verification", "profile_update", "admin_broadcast", "new_policy", "deadline_reminder", "scheme_update", "system"],
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
