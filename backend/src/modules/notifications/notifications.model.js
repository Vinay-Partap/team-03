// notifications.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationsSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("Notifications", notificationsSchema);
