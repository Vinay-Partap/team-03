const reportsService = require("./reports.service");

const getReportsData = async (req, res) => {
  try {
    const data = await reportsService.getReportsData();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    const type = req.query.type || "policies";
    const { csvData, filename } = await reportsService.exportCSV(type, req.user.id);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    return res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReportsData,
  exportCSV,
};
