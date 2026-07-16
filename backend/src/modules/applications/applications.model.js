const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    schemeId: { type: Schema.Types.ObjectId, ref: "Schemes", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "under_review", "approved", "rejected"],
      default: "applied",
    },
    remarks: { type: String, default: "" },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", applicationSchema);
