// eligibility.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eligibilitySchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Eligibility", eligibilitySchema);
