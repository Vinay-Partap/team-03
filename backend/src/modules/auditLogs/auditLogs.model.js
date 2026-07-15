// auditLogs.model.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const auditLogsSchema = new Schema(
{

},
{
timestamps:true
}
);

module.exports = mongoose.model("AuditLogs", auditLogsSchema);
