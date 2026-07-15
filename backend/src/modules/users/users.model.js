// users.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Users", usersSchema);
