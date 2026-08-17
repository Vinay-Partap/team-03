const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    allowedDomain: { type: String, default: "*", required: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Admin", adminSchema);
