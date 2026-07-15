const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Import modules routes
const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const policiesRoutes = require("./modules/policies/policies.routes");
const schemesRoutes = require("./modules/schemes/schemes.routes");
const eligibilityRoutes = require("./modules/eligibility/eligibility.routes");
const notificationsRoutes = require("./modules/notifications/notifications.routes");
const feedbackRoutes = require("./modules/feedback/feedback.routes");
const reportsRoutes = require("./modules/reports/reports.routes");
const auditLogsRoutes = require("./modules/auditLogs/auditLogs.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/policies", policiesRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
