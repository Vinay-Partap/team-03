const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["feedback", "issue", "contact"],
      default: "feedback",
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
