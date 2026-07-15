// applications.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationsSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Applications", applicationsSchema);
