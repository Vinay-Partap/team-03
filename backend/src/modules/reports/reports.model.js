// reports.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportsSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Reports", reportsSchema);
