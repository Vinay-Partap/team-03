const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Null represents global broadcast
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["new_policy", "deadline_reminder", "scheme_update", "system"],
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
