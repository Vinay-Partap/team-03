import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Download,
  Files,
  ShieldCheck,
} from "lucide-react";

const summary = [
  { label: "Pending reviews", value: "18", change: "3 urgent", tone: "amber" },
  { label: "Active admins", value: "27", change: "Online now", tone: "blue" },
  { label: "Resolved tickets", value: "142", change: "+18%", tone: "green" },
  { label: "Audit score", value: "94%", change: "Stable", tone: "violet" },
];

const activityItems = [
  { title: "Policy approval queue", detail: "12 new items require review", time: "10 min ago" },
  { title: "User access request", detail: "District admin requested elevated permissions", time: "38 min ago" },
  { title: "Data sync complete", detail: "Citizen records updated from all districts", time: "1 hr ago" },
];

const quickActions = [
  "Approve pending claims",
  "Review feedback reports",
  "Launch audit workflow",
  "Send system alert",
];

const workstreams = [
  { title: "Approvals", count: "24" },
  { title: "Support issues", count: "9" },
  { title: "Reports", count: "13" },
];

const reportDownloads = [
  { title: "Monthly audit report", type: "PDF" },
  { title: "District performance sheet", type: "Excel" },
  { title: "Compliance summary", type: "CSV" },
];

const bottomHighlights = [
  { label: "Reports ready", value: "14", tone: "blue" },
  { label: "Pending review", value: "6", tone: "amber" },
  { label: "Escalations", value: "2", tone: "green" },
];

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard-page">
      <style>{styles}</style>

      <header className="admin-dashboard-topbar">
        <div className="admin-dashboard-brand">
          <span className="admin-dashboard-brand-mark">
            <ShieldCheck size={24} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="admin-dashboard-eyebrow">Admin control center</p>
            <h1>Administrator Dashboard</h1>
          </div>
        </div>
        <button className="admin-dashboard-chip" type="button">
          <Activity size={16} strokeWidth={2} aria-hidden="true" />
          System healthy
        </button>
      </header>

      <section className="admin-dashboard-content">
        <motion.div className="admin-dashboard-hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div>
            <p className="admin-dashboard-eyebrow">Operations overview</p>
            <h2>Manage approvals, governance data, and support requests in one place.</h2>
          </div>
          <button className="admin-dashboard-primary-btn" type="button">Open admin actions</button>
        </motion.div>

        <div className="admin-dashboard-metrics">
          {summary.map((item, index) => (
            <motion.article className={`admin-dashboard-metric admin-dashboard-metric--${item.tone}`} key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: index * 0.05 }}>
              <div className="admin-dashboard-metric-top">
                <span className="admin-dashboard-metric-value">{item.value}</span>
                <span className="admin-dashboard-metric-change">{item.change}</span>
              </div>
              <p>{item.label}</p>
            </motion.article>
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <motion.section className="admin-dashboard-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.12 }}>
            <div className="admin-dashboard-card-header">
              <div>
                <p className="admin-dashboard-eyebrow">Live activity</p>
                <h3>Latest admin tasks</h3>
              </div>
              <span className="admin-dashboard-pill">Updated now</span>
            </div>
            <div className="admin-dashboard-activity-list">
              {activityItems.map((item) => (
                <div className="admin-dashboard-activity-item" key={item.title}>
                  <div className="admin-dashboard-activity-icon"><CheckCircle2 size={16} strokeWidth={2.2} aria-hidden="true" /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="admin-dashboard-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.16 }}>
            <div className="admin-dashboard-card-header">
              <div>
                <p className="admin-dashboard-eyebrow">Quick actions</p>
                <h3>Recommended next steps</h3>
              </div>
            </div>
            <div className="admin-dashboard-actions">
              {quickActions.map((action) => (
                <button key={action} className="admin-dashboard-action-btn" type="button">
                  {action}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="admin-dashboard-workstreams">
              {workstreams.map((item) => (
                <div key={item.title} className="admin-dashboard-workstream-item">
                  <div className="admin-dashboard-workstream-icon"><Files size={16} strokeWidth={2.2} aria-hidden="true" /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.count} awaiting action</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-dashboard-download-section">
              <div className="admin-dashboard-card-header admin-dashboard-card-header--compact">
                <div>
                  <p className="admin-dashboard-eyebrow">Download reports</p>
                  <h3>Export ready files</h3>
                </div>
              </div>
              <div className="admin-dashboard-download-list">
                {reportDownloads.map((item) => (
                  <button key={item.title} className="admin-dashboard-download-btn" type="button">
                    <span className="admin-dashboard-download-icon"><Download size={15} strokeWidth={2.2} aria-hidden="true" /></span>
                    <span className="admin-dashboard-download-label">
                      <strong>{item.title}</strong>
                      <small>{item.type}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        <motion.section className="admin-dashboard-bottom-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.2 }}>
          <div className="admin-dashboard-bottom-panel-header">
            <div>
              <p className="admin-dashboard-eyebrow">Operations snapshot</p>
              <h3>Department health overview</h3>
            </div>
            <button className="admin-dashboard-bottom-panel-btn" type="button">View full report</button>
          </div>
          <div className="admin-dashboard-bottom-highlights">
            {bottomHighlights.map((item) => (
              <div key={item.label} className={`admin-dashboard-bottom-highlight admin-dashboard-bottom-highlight--${item.tone}`}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </section>
    </main>
  );
}

const styles = `
  .admin-dashboard-page { min-height: 100vh; background: #f6f9ff; color: #13253f; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .admin-dashboard-topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 32px 18px; border-bottom: 1px solid #e3ebf8; background: rgba(255,255,255,0.92); }
  .admin-dashboard-brand { display: flex; align-items: center; gap: 12px; }
  .admin-dashboard-brand-mark { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #1b4f92 0%, #2f6dda 100%); color: #fff; box-shadow: 0 10px 24px rgba(31, 83, 168, 0.2); }
  .admin-dashboard-brand h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
  .admin-dashboard-eyebrow { margin: 0 0 3px; color: #6a7b95; font-size: 11px; font-weight: 800; letter-spacing: 0.28em; text-transform: uppercase; }
  .admin-dashboard-chip { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #dfe8f5; border-radius: 999px; background: #fff; color: #2f67c0; font-size: 13px; font-weight: 800; cursor: pointer; }
  .admin-dashboard-content { width: min(100% - 40px, 1280px); margin: 0 auto; padding: 28px 0 46px; }
  .admin-dashboard-hero { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 26px; border-radius: 24px; background: linear-gradient(120deg, #133c67 0%, #1f66c4 100%); color: #fff; box-shadow: 0 18px 38px rgba(12, 54, 105, 0.18); }
  .admin-dashboard-hero h2 { margin: 6px 0 0; font-size: 22px; letter-spacing: -0.4px; }
  .admin-dashboard-primary-btn { padding: 11px 16px; border: 0; border-radius: 999px; background: #fff; color: #175296; font-weight: 800; cursor: pointer; }
  .admin-dashboard-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 16px; }
  .admin-dashboard-metric { padding: 18px 18px; border-radius: 20px; border: 1px solid #e4ebf7; background: #fff; box-shadow: 0 12px 26px rgba(15, 35, 63, 0.05); }
  .admin-dashboard-metric-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .admin-dashboard-metric-value { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #122843; }
  .admin-dashboard-metric-change { font-size: 12px; font-weight: 800; color: #2b7a53; }
  .admin-dashboard-metric p { margin: 8px 0 0; color: #61758a; font-size: 13px; font-weight: 700; }
  .admin-dashboard-metric--amber .admin-dashboard-metric-change { color: #af6b12; }
  .admin-dashboard-metric--blue .admin-dashboard-metric-change { color: #2468c8; }
  .admin-dashboard-metric--green .admin-dashboard-metric-change { color: #2b7a53; }
  .admin-dashboard-metric--violet .admin-dashboard-metric-change { color: #6e23b2; }
  .admin-dashboard-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px; margin-top: 16px; }
  .admin-dashboard-card { padding: 20px; border-radius: 22px; border: 1px solid #e4ebf7; background: #fff; box-shadow: 0 12px 24px rgba(15, 35, 63, 0.05); }
  .admin-dashboard-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .admin-dashboard-card-header h3 { margin: 0; font-size: 17px; color: #142842; }
  .admin-dashboard-pill { display: inline-flex; align-items: center; padding: 7px 10px; border-radius: 999px; background: #eaf2ff; color: #1f64c8; font-size: 12px; font-weight: 800; }
  .admin-dashboard-activity-list { display: flex; flex-direction: column; gap: 10px; }
  .admin-dashboard-activity-item { display: flex; gap: 10px; padding: 12px; border-radius: 14px; background: #f7faff; border: 1px solid #e8eef7; }
  .admin-dashboard-activity-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #e9f7ee; color: #249d58; flex-shrink: 0; }
  .admin-dashboard-activity-item strong { display: block; color: #15273e; font-size: 14px; }
  .admin-dashboard-activity-item p { margin: 3px 0 0; color: #64758a; font-size: 13px; }
  .admin-dashboard-activity-item span { display: inline-block; margin-top: 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #94a1b3; }
  .admin-dashboard-actions { display: flex; flex-direction: column; gap: 10px; }
  .admin-dashboard-action-btn { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border: 1px solid #e2eaf5; border-radius: 14px; background: #f7faff; color: #17375f; font-weight: 700; cursor: pointer; }
  .admin-dashboard-workstreams { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
  .admin-dashboard-workstream-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 13px; background: #f7faff; border: 1px solid #e2eaf5; }
  .admin-dashboard-workstream-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #eaf2ff; color: #1f64c8; flex-shrink: 0; }
  .admin-dashboard-workstream-item strong { display: block; color: #142842; font-size: 14px; }
  .admin-dashboard-workstream-item p { margin: 3px 0 0; color: #64758a; font-size: 13px; }
  .admin-dashboard-download-section { margin-top: 14px; padding-top: 12px; border-top: 1px solid #e8eef7; }
  .admin-dashboard-card-header--compact { margin-bottom: 10px; }
  .admin-dashboard-download-list { display: flex; flex-direction: column; gap: 10px; }
  .admin-dashboard-download-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e2eaf5; border-radius: 13px; background: #f7faff; color: #17375f; cursor: pointer; text-align: left; }
  .admin-dashboard-download-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #eaf2ff; color: #1f64c8; flex-shrink: 0; }
  .admin-dashboard-download-label { display: flex; flex-direction: column; gap: 2px; }
  .admin-dashboard-download-label strong { font-size: 13px; color: #142842; }
  .admin-dashboard-download-label small { font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: #6d7b92; }
  .admin-dashboard-bottom-panel { margin-top: 16px; padding: 22px; border-radius: 24px; border: 1px solid #e4ebf7; background: linear-gradient(135deg, #f9fbff 0%, #eef5ff 100%); box-shadow: 0 12px 24px rgba(15, 35, 63, 0.05); }
  .admin-dashboard-bottom-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .admin-dashboard-bottom-panel-header h3 { margin: 0; font-size: 17px; color: #142842; }
  .admin-dashboard-bottom-panel-btn { border: 0; border-radius: 999px; padding: 10px 14px; background: #1f64c8; color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; }
  .admin-dashboard-bottom-highlights { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .admin-dashboard-bottom-highlight { padding: 14px; border-radius: 16px; background: #fff; border: 1px solid #e4ebf7; }
  .admin-dashboard-bottom-highlight strong { display: block; font-size: 24px; color: #122843; margin-bottom: 4px; }
  .admin-dashboard-bottom-highlight span { color: #64758a; font-size: 13px; font-weight: 700; }
  .admin-dashboard-bottom-highlight--blue strong { color: #1f64c8; }
  .admin-dashboard-bottom-highlight--amber strong { color: #af6b12; }
  .admin-dashboard-bottom-highlight--green strong { color: #249d58; }
  @media (max-width: 980px) { .admin-dashboard-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .admin-dashboard-grid { grid-template-columns: 1fr; } .admin-dashboard-bottom-highlights { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .admin-dashboard-topbar { flex-direction: column; align-items: flex-start; padding: 18px 20px; } .admin-dashboard-content { width: min(100% - 24px, 1280px); padding-top: 18px; } .admin-dashboard-hero { flex-direction: column; align-items: flex-start; padding: 20px; } .admin-dashboard-metrics { grid-template-columns: 1fr; } }
`;
