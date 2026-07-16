const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eligibilitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    profile: {
      age: { type: Number },
      gender: { type: String },
      income: { type: Number },
      occupation: { type: String },
      education: { type: String },
      state: { type: String },
      category: { type: String },
      disability: { type: Boolean },
    },
    results: [
      {
        schemeId: { type: Schema.Types.ObjectId, ref: "Schemes" },
        isEligible: { type: Boolean },
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Eligibility", eligibilitySchema);
