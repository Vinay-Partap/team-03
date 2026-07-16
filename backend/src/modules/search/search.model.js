const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema(
  {
    query: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Search", searchSchema);
