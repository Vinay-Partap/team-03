// auth.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Auth", authSchema);
