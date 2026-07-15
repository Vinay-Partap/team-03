import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  FileText,
  Landmark,
  Shield,
  Table2,
  UsersRound,
  WalletCards,
} from "lucide-react";

const metrics = [
  {
    icon: UsersRound,
    value: "12.4M",
    label: "Total beneficiaries",
    change: "+6.4% QoQ",
    tone: "blue",
  },
  {
    icon: WalletCards,
    value: "₹8,240 Cr",
    label: "Budget utilized",
    change: "82% of allocation",
    tone: "green",
  },
  {
    icon: FileText,
    value: "3,105",
    label: "Active schemes tracked",
    change: "+42 this qtr",
    tone: "blue",
  },
  {
    icon: Landmark,
    value: "186",
    label: "Reports generated",
    change: "This quarter",
    tone: "gold",
  },
];

const reports = [
  {
    name: "Q4 Beneficiary Impact Report",
    department: "Agriculture",
    date: "01 Jul 2026",
    format: "PDF",
  },
  {
    name: "Annual Budget Utilization Summary",
    department: "Finance",
    date: "28 Jun 2026",
    format: "Excel",
  },
  {
    name: "State-wise Scheme Adoption Report",
    department: "Rural Development",
    date: "20 Jun 2026",
    format: "PDF",
  },
  {
    name: "Eligibility Checker Usage Analytics",
    department: "Platform",
    date: "12 Jun 2026",
    format: "Excel",
  },
];

const reportCsv = [
  ["Report name", "Department", "Generated on", "Format"],
  ...reports.map((report) => [
    report.name,
    report.department,
    report.date,
    report.format,
  ]),
]
  .map((row) => row.map((cell) => `"${cell}"`).join(","))
  .join("\n");

function downloadSpreadsheet(filename = "government-reports.xls") {
  const file = new Blob([reportCsv], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [range, setRange] = useState("Last 12 months");

  const printReport = () => window.print();

  return (
    <main className="reports-page">
      <style>{styles}</style>

      <header className="reports-topbar">
        <div className="reports-brand" aria-label="GovIntel Admin Console">
          <span className="reports-brand-mark">
            <Shield size={28} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <span>GovIntel · Admin Console</span>
        </div>

        <div className="reports-topbar-actions">
          <span className="reports-dashboard-link">Dashboard</span>
          <span className="reports-avatar" aria-label="User AK">AK</span>
        </div>
      </header>

      <section className="reports-content" aria-labelledby="reports-title">
        <motion.div
          className="reports-heading-row"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <div>
            <h1 id="reports-title">Reports &amp; analytics</h1>
            <p>Scheme performance across departments · FY 2025–26</p>
          </div>

          <div className="reports-controls" aria-label="Report controls">
            <label className="reports-select-wrap">
              <span className="sr-only">Reporting period</span>
              <select
                aria-label="Reporting period"
                value={range}
                onChange={(event) => setRange(event.target.value)}
              >
                <option>Last 12 months</option>
                <option>This financial year</option>
                <option>Last quarter</option>
              </select>
              <ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" />
            </label>
            <button className="reports-action-button" type="button" onClick={printReport}>
              <FileText size={18} strokeWidth={2} aria-hidden="true" />
              Export PDF
            </button>
            <button
              className="reports-action-button"
              type="button"
              onClick={() => downloadSpreadsheet()}
            >
              <Table2 size={18} strokeWidth={2} aria-hidden="true" />
              Export Excel
            </button>
          </div>
        </motion.div>

        <div className="reports-metrics" aria-label="Report summary metrics">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.article
                className="reports-metric"
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
              >
                <div className="reports-metric-top">
                  <span className={`reports-metric-icon reports-metric-icon--${metric.tone}`}>
                    <Icon size={24} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="reports-metric-change">{metric.change}</span>
                </div>
                <strong>{metric.value}</strong>
                <span className="reports-metric-label">{metric.label}</span>
              </motion.article>
            );
          })}
        </div>

        <div className="reports-analytics" aria-label="Analytics visualizations">
          <motion.section
            className="reports-chart-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            aria-label="Beneficiaries reached per quarter chart"
          >
            <h2>Beneficiaries reached per quarter</h2>
          </motion.section>
          <motion.section
            className="reports-chart-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26, ease: "easeOut" }}
            aria-label="Budget utilization by category chart"
          >
            <h2>Budget utilization by category</h2>
          </motion.section>
        </div>

        <motion.section
          className="reports-table-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32, ease: "easeOut" }}
          aria-labelledby="generated-reports-title"
        >
          <h2 id="generated-reports-title">Generated reports</h2>
          <div className="reports-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Report name</th>
                  <th>Department</th>
                  <th>Generated on</th>
                  <th>Format</th>
                  <th><span className="sr-only">Download</span></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.name}>
                    <td>{report.name}</td>
                    <td>{report.department}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`reports-format reports-format--${report.format.toLowerCase()}`}>
                        {report.format}
                      </span>
                    </td>
                    <td>
                      <button
                        className="reports-download-button"
                        type="button"
                        onClick={() =>
                          report.format === "PDF"
                            ? printReport()
                            : downloadSpreadsheet(`${report.name.toLowerCase().replaceAll(" ", "-")}.xls`)
                        }
                      >
                        <Download size={17} strokeWidth={2} aria-hidden="true" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </section>
    </main>
  );
}

const styles = `
  .reports-page {
    min-height: 100vh;
    background: #f5f7fb;
    color: #1f293d;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .reports-page *, .reports-page *::before, .reports-page *::after { box-sizing: border-box; }
  .reports-page button, .reports-page select { font: inherit; }

  .reports-topbar {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 31px;
    background: #ffffff;
    border-bottom: 1px solid #e4e9f1;
  }

  .reports-brand, .reports-topbar-actions, .reports-controls, .reports-metric-top,
  .reports-action-button, .reports-download-button, .reports-select-wrap {
    display: flex;
    align-items: center;
  }

  .reports-brand {
    gap: 14px;
    color: #1e2b41;
    font-size: 18px;
    font-weight: 760;
    letter-spacing: -0.4px;
  }

  .reports-brand-mark {
    width: 45px;
    height: 45px;
    display: grid;
    place-items: center;
    color: #ffffff;
    background: #173e7a;
    border-radius: 11px;
    box-shadow: 0 3px 7px rgba(26, 62, 119, 0.18);
  }

  .reports-topbar-actions { gap: 34px; }
  .reports-dashboard-link { color: #425068; font-size: 14px; font-weight: 700; }

  .reports-avatar {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #e9f0ff;
    color: #245196;
    font-size: 16px;
    font-weight: 800;
  }

  .reports-content {
    width: min(100% - 48px, 1452px);
    margin: 0 auto;
    padding: 40px 0 58px;
  }

  .reports-heading-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 28px;
  }

  .reports-heading-row h1, .reports-heading-row p, .reports-chart-panel h2,
  .reports-table-panel h2 { margin: 0; }

  .reports-heading-row h1 {
    color: #1e293d;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.9px;
  }

  .reports-heading-row p {
    margin-top: 7px;
    color: #364258;
    font-size: 17px;
    line-height: 1.45;
    letter-spacing: -0.25px;
  }

  .reports-controls { gap: 13px; padding-top: 11px; }

  .reports-select-wrap {
    position: relative;
    height: 40px;
    color: #2c374b;
    background: #ffffff;
    border: 1px solid #dfe6f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(31, 41, 55, 0.02);
  }

  .reports-select-wrap select {
    width: 164px;
    height: 100%;
    appearance: none;
    cursor: pointer;
    padding: 0 34px 0 13px;
    color: inherit;
    background: transparent;
    border: 0;
    outline: 0;
    font-size: 14px;
    font-weight: 500;
  }

  .reports-select-wrap svg { position: absolute; right: 10px; pointer-events: none; }

  .reports-action-button, .reports-download-button {
    justify-content: center;
    gap: 9px;
    cursor: pointer;
    color: #245296;
    background: #ffffff;
    border: 1px solid #dfe6f0;
    border-radius: 9px;
    font-weight: 750;
    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }

  .reports-action-button {
    height: 40px;
    padding: 0 18px;
    font-size: 14px;
  }

  .reports-action-button:hover, .reports-download-button:hover {
    background: #f8fbff;
    border-color: #b9cbea;
    box-shadow: 0 3px 9px rgba(31, 71, 130, 0.08);
    transform: translateY(-1px);
  }

  .reports-action-button:focus-visible, .reports-download-button:focus-visible, .reports-select-wrap:focus-within {
    outline: 3px solid rgba(70, 127, 210, 0.24);
    outline-offset: 2px;
  }

  .reports-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 29px;
  }

  .reports-metric {
    min-height: 193px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #dfe6f0;
    border-radius: 16px;
    box-shadow: 0 2px 2px rgba(18, 38, 63, 0.04);
  }

  .reports-metric-top { justify-content: space-between; }

  .reports-metric-icon {
    width: 47px;
    height: 47px;
    display: grid;
    place-items: center;
    border-radius: 12px;
  }

  .reports-metric-icon--blue { color: #275aa3; background: #e9f0ff; }
  .reports-metric-icon--green { color: #12935c; background: #e4f6ec; }
  .reports-metric-icon--gold { color: #bd7414; background: #fcf1dd; }

  .reports-metric-change { color: #11905b; font-size: 14px; font-weight: 750; }

  .reports-metric strong {
    margin-top: 25px;
    color: #1c273b;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1.8px;
  }

  .reports-metric-label { margin-top: 21px; color: #64748d; font-size: 14px; font-weight: 650; }

  .reports-analytics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-top: 24px;
  }

  .reports-chart-panel {
    min-height: 413px;
    padding: 26px 24px;
    background: #ffffff;
    border: 1px solid #dfe6f0;
    border-radius: 16px;
    box-shadow: 0 2px 2px rgba(18, 38, 63, 0.04);
  }

  .reports-chart-panel h2, .reports-table-panel h2 {
    color: #1f2b40;
    font-size: 16px;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.42px;
  }

  .reports-table-panel {
    margin-top: 24px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #dfe6f0;
    border-radius: 16px;
    box-shadow: 0 2px 2px rgba(18, 38, 63, 0.04);
  }

  .reports-table-panel h2 { min-height: 70px; display: flex; align-items: center; padding: 0 24px; }
  .reports-table-scroll { overflow-x: auto; }
  .reports-table-panel table { width: 100%; min-width: 830px; border-collapse: collapse; table-layout: fixed; }
  .reports-table-panel th, .reports-table-panel td { text-align: left; }
  .reports-table-panel th {
    height: 53px;
    padding: 0 19px;
    color: #657791;
    background: #f5f7fb;
    border-bottom: 1px solid #dfe6f0;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.45px;
    text-transform: uppercase;
  }
  .reports-table-panel td {
    height: 75px;
    padding: 0 19px;
    color: #2c374a;
    border-bottom: 1px solid #e8edf4;
    font-size: 14px;
    font-weight: 500;
  }
  .reports-table-panel tbody tr:last-child td { border-bottom: 0; }
  .reports-table-panel th:nth-child(1) { width: 34%; }
  .reports-table-panel th:nth-child(2) { width: 20%; }
  .reports-table-panel th:nth-child(3) { width: 17%; }
  .reports-table-panel th:nth-child(4) { width: 11%; }
  .reports-table-panel th:nth-child(5) { width: 18%; }

  .reports-format {
    display: inline-flex;
    align-items: center;
    min-height: 31px;
    padding: 0 13px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
  }
  .reports-format--pdf { color: #d94d43; background: #fdebe8; }
  .reports-format--excel { color: #16945f; background: #e4f6ec; }

  .reports-download-button { height: 39px; padding: 0 16px; font-size: 14px; white-space: nowrap; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

  @media (max-width: 980px) {
    .reports-heading-row { flex-direction: column; }
    .reports-controls { width: 100%; flex-wrap: wrap; padding-top: 0; }
    .reports-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 640px) {
    .reports-topbar { height: 72px; padding: 0 18px; }
    .reports-brand { gap: 10px; font-size: 15px; }
    .reports-brand-mark { width: 39px; height: 39px; border-radius: 10px; }
    .reports-brand-mark svg { width: 23px; }
    .reports-topbar-actions { gap: 15px; }
    .reports-dashboard-link { display: none; }
    .reports-avatar { width: 39px; height: 39px; border-radius: 11px; font-size: 14px; }
    .reports-content { width: min(100% - 32px, 1452px); padding-top: 27px; }
    .reports-heading-row h1 { font-size: 25px; }
    .reports-heading-row p { font-size: 15px; }
    .reports-controls { gap: 9px; }
    .reports-select-wrap { flex: 1 1 100%; }
    .reports-select-wrap select { width: 100%; }
    .reports-action-button { flex: 1 1 calc(50% - 5px); padding: 0 10px; }
    .reports-metrics, .reports-analytics { grid-template-columns: 1fr; gap: 16px; }
    .reports-metrics { margin-top: 23px; }
    .reports-metric { min-height: 175px; }
    .reports-analytics, .reports-table-panel { margin-top: 16px; }
    .reports-chart-panel { min-height: 250px; }
  }

  @media print {
    .reports-topbar, .reports-controls, .reports-download-button { display: none !important; }
    .reports-page { background: #ffffff; }
    .reports-content { width: 100%; padding: 0; }
    .reports-chart-panel, .reports-metric, .reports-table-panel { box-shadow: none; }
  }
`;
