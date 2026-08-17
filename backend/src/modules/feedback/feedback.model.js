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
    ticketId: { type: String, unique: true, sparse: true },
    category: { type: String, default: "General Feedback" }, priority: { type: String, enum:["low","normal","high","urgent"], default:"normal" },
    status: { type: String, enum: ["open","in_progress","waiting_for_citizen","resolved","closed"], default: "open" },
    assignedTo: { type: Schema.Types.ObjectId, ref:"User", default:null }, assignedAt: {type:Date,default:null}, resolutionNote:{type:String,default:""}, resolvedBy:{type:Schema.Types.ObjectId,ref:"User",default:null}, resolvedAt:{type:Date,default:null}, lastResponseAt:{type:Date,default:null},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
