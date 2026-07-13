// schemes.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemesSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Schemes", schemesSchema);
