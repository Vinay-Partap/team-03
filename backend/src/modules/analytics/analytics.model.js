// analytics.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analyticsSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Analytics", analyticsSchema);
