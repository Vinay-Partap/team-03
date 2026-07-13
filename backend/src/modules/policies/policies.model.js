// policies.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const policiesSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Policies", policiesSchema);
