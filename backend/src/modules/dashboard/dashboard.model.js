const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dashboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    widgetsLayout: [{ type: String }],
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Dashboard", dashboardSchema);
