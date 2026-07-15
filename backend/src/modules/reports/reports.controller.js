const User = require("../users/users.model");
const Policy = require("../policies/policies.model");
const Scheme = require("../schemes/schemes.model");

const getReportsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPolicies = await Policy.countDocuments();
    const totalSchemes = await Scheme.countDocuments();

    // Department breakdown
    const policiesByDept = await Policy.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const schemesByDept = await Scheme.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    // Categories breakdown
    const schemesByCat = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Demographics breakdown (gender, age group)
    const usersByGender = await User.aggregate([
      { $group: { _id: "$profile.gender", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      summary: { totalUsers, totalPolicies, totalSchemes },
      policiesByDept,
      schemesByDept,
      schemesByCat,
      usersByGender,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    const type = req.query.type || "policies"; // policies or schemes
    let csvData = "";

    if (type === "policies") {
      const policies = await Policy.find();
      csvData += "Title,Description,Category,Department,State,Status,Deadline,Created Date\n";
      policies.forEach((p) => {
        csvData += `"${p.title.replace(/"/g, '""')}","${p.description.replace(/"/g, '""')}","${p.category}","${p.department}","${p.state}","${p.status}","${p.deadline || "N/A"}","${p.createdAt.toISOString()}"\n`;
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=policies_report.csv");
    } else {
      const schemes = await Scheme.find();
      csvData += "Title,Description,Category,Department,State,Status,AgeMin,AgeMax,GenderLimit,IncomeMax,Created Date\n";
      schemes.forEach((s) => {
        const rules = s.eligibilityRules || {};
        csvData += `"${s.title.replace(/"/g, '""')}","${s.description.replace(/"/g, '""')}","${s.category}","${s.department}","${s.state}","${s.status}","${rules.ageMin}","${rules.ageMax}","${rules.gender}","${rules.incomeMax || "No Limit"}","${s.createdAt.toISOString()}"\n`;
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=schemes_report.csv");
    }

    return res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReportsData,
  exportCSV,
};
