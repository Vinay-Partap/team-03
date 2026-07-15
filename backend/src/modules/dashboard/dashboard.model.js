// dashboard.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dashboardSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Dashboard", dashboardSchema);
