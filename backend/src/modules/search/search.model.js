// search.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const searchSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Search", searchSchema);
