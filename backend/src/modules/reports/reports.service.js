const reportsRepository = require("./reports.repository");

class ReportsService {
  async getReportsData() {
    return await reportsRepository.getAggregates();
  }

  async exportCSV(type, userId) {
    let csvData = "";

    if (type === "policies") {
      const policies = await reportsRepository.getPolicies();
      csvData += "Title,Description,Category,Department,State,Status,Deadline,Created Date\n";
      policies.forEach((p) => {
        csvData += `"${p.title.replace(/"/g, '""')}","${p.description.replace(/"/g, '""')}","${p.category}","${p.department}","${p.state}","${p.status}","${p.deadline || "N/A"}","${p.createdAt.toISOString()}"\n`;
      });
      await reportsRepository.createDownloadLog({ userId, type: "csv", target: "policies" });
      return { csvData, filename: "policies_report.csv" };
    } else {
      const schemes = await reportsRepository.getSchemes();
      csvData += "Title,Description,Category,Department,State,Status,AgeMin,AgeMax,GenderLimit,IncomeMax,Created Date\n";
      schemes.forEach((s) => {
        const rules = s.eligibilityRules || {};
        csvData += `"${s.title.replace(/"/g, '""')}","${s.description.replace(/"/g, '""')}","${s.category}","${s.department}","${s.state}","${s.status}","${rules.ageMin}","${rules.ageMax}","${rules.gender}","${rules.incomeMax || "No Limit"}","${s.createdAt.toISOString()}"\n`;
      });
      await reportsRepository.createDownloadLog({ userId, type: "csv", target: "schemes" });
      return { csvData, filename: "schemes_report.csv" };
    }
  }
}

module.exports = new ReportsService();
