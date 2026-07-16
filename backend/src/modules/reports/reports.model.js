const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["csv", "pdf"], required: true },
    target: { type: String, required: true },
    downloadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reports", reportsSchema);
