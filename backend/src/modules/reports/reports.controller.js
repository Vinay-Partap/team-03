const reportsService = require("./reports.service");

const getReportsData = async (req, res) => {
  try {
    const data = await reportsService.getReportsData();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportReport = async (req, res) => {
  try {
    const type = req.query.type || "policies";
    const format = req.query.format || "csv";

    if (format === "pdf") {
      const { pdfBuffer, filename } = await reportsService.exportPDF(type, req.user);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      return res.status(200).send(pdfBuffer);
    } else if (format === "excel" || format === "xlsx") {
      const { excelBuffer, filename } = await reportsService.exportExcel(type, req.user);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      return res.status(200).send(excelBuffer);
    } else {
      const { csvData, filename } = await reportsService.exportCSV(type, req.user);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      return res.status(200).send(csvData);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReportsData,
  exportCSV: exportReport,
};
