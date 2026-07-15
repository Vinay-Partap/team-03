// feedback.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Feedback", feedbackSchema);
