const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new Schema(
  {
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["policy", "scheme"], required: true },
    views: { type: Number, default: 1 },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
