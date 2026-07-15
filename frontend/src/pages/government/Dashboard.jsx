import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const metrics = [
  { label: "Active schemes", value: "184", change: "+12%", tone: "blue" },
  { label: "Pending approvals", value: "29", change: "5 urgent", tone: "amber" },
  { label: "Citizens served", value: "12.4M", change: "+8.2%", tone: "green" },
  { label: "Reports generated", value: "386", change: "This week", tone: "violet" },
];

const performanceBars = [
  { label: "Agriculture", value: 82 },
  { label: "Health", value: 74 },
  { label: "Education", value: 68 },
  { label: "Housing", value: 91 },
];

const notifications = [
  { title: "Budget review due", detail: "Finance team needs sign-off by 5:00 PM", time: "12 min ago" },
  { title: "New feedback submitted", detail: "3 district offices reported low adoption", time: "34 min ago" },
  { title: "Scheme audit completed", detail: "No critical issues found in 4 departments", time: "1 hr ago" },
];

const pendingUsers = [
  { name: "Aarav Sharma", role: "District Officer", status: "Verification pending" },
  { name: "Meera Nair", role: "Compliance Lead", status: "Awaiting approval" },
  { name: "Rohan Singh", role: "Treasury Admin", status: "Needs review" },
];

const reports = [
  { name: "Quarterly Impact Summary", owner: "Planning Cell", date: "14 Jul 2026" },
  { name: "Citizen Satisfaction Pulse", owner: "Policy Lab", date: "11 Jul 2026" },
  { name: "Eligibility Adoption Report", owner: "Digital Services", date: "09 Jul 2026" },
];

export default function GovernmentDashboard() {
  return (
    <main className="gov-dashboard-page">
      <style>{styles}</style>

      <header className="gov-dashboard-topbar">
        <div className="gov-dashboard-brand">
          <span className="gov-dashboard-brand-mark">
            <ShieldCheck size={26} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="gov-dashboard-eyebrow">Admin portal</p>
            <h1>Government Operations Dashboard</h1>
          </div>
        </div>

        <div className="gov-dashboard-topbar-actions">
          <button className="gov-dashboard-chip" type="button">
            <BellRing size={16} strokeWidth={2} aria-hidden="true" />
            Alerts (3)
          </button>
          <div className="gov-dashboard-avatar">AK</div>
        </div>
      </header>

      <section className="gov-dashboard-content" aria-label="Dashboard overview">
        <motion.div
          className="gov-dashboard-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div>
            <p className="gov-dashboard-eyebrow">Live monitoring</p>
            <h2>Policy delivery is trending positively across districts.</h2>
            <p className="gov-dashboard-hero-copy">
              Track approvals, citizen reach, and policy outcomes from one place.
            </p>
          </div>
          <div className="gov-dashboard-hero-actions">
            <button type="button" className="gov-dashboard-primary-btn">
              Review approvals
            </button>
            <button type="button" className="gov-dashboard-secondary-btn">
              Export report
            </button>
          </div>
        </motion.div>

        <div className="gov-dashboard-metrics" aria-label="Summary metrics">
          {metrics.map((metric, index) => (
            <motion.article
              className={`gov-dashboard-metric gov-dashboard-metric--${metric.tone}`}
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.06, ease: "easeOut" }}
            >
              <div className="gov-dashboard-metric-top">
                <span className="gov-dashboard-metric-value">{metric.value}</span>
                <span className="gov-dashboard-metric-change">{metric.change}</span>
              </div>
              <p>{metric.label}</p>
            </motion.article>
          ))}
        </div>

        <div className="gov-dashboard-grid">
          <motion.section
            className="gov-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.12, ease: "easeOut" }}
          >
            <div className="gov-dashboard-card-header">
              <div>
                <p className="gov-dashboard-eyebrow">Analytics</p>
                <h3>Scheme adoption trend</h3>
              </div>
              <span className="gov-dashboard-pill">+14.6%</span>
            </div>

            <div className="gov-dashboard-chart" aria-label="Performance chart">
              {performanceBars.map((bar) => (
                <div className="gov-dashboard-bar-row" key={bar.label}>
                  <div className="gov-dashboard-bar-labels">
                    <span>{bar.label}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="gov-dashboard-track">
                    <div className="gov-dashboard-fill" style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="gov-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.16, ease: "easeOut" }}
          >
            <div className="gov-dashboard-card-header">
              <div>
                <p className="gov-dashboard-eyebrow">Notifications</p>
                <h3>Live alerts</h3>
              </div>
              <span className="gov-dashboard-pill gov-dashboard-pill--soft">Today</span>
            </div>

            <div className="gov-dashboard-list">
              {notifications.map((item) => (
                <div className="gov-dashboard-list-item" key={item.title}>
                  <div className="gov-dashboard-list-icon">
                    <AlertTriangle size={16} strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="gov-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.2, ease: "easeOut" }}
          >
            <div className="gov-dashboard-card-header">
              <div>
                <p className="gov-dashboard-eyebrow">User management</p>
                <h3>Pending verification</h3>
              </div>
              <span className="gov-dashboard-pill">3 tasks</span>
            </div>

            <div className="gov-dashboard-table">
              {pendingUsers.map((user) => (
                <div className="gov-dashboard-table-row" key={user.name}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.role}</p>
                  </div>
                  <span className="gov-dashboard-status">{user.status}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="gov-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.24, ease: "easeOut" }}
          >
            <div className="gov-dashboard-card-header">
              <div>
                <p className="gov-dashboard-eyebrow">Reports</p>
                <h3>Recent documents</h3>
              </div>
              <a href="#" className="gov-dashboard-link">
                View all <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>

            <div className="gov-dashboard-list gov-dashboard-list--compact">
              {reports.map((item) => (
                <div className="gov-dashboard-list-item gov-dashboard-list-item--compact" key={item.name}>
                  <div className="gov-dashboard-list-icon gov-dashboard-list-icon--soft">
                    <FileText size={16} strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div className="gov-dashboard-report-meta">
                    <strong>{item.name}</strong>
                    <p>{item.owner}</p>
                  </div>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}

const styles = `
  .gov-dashboard-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f5f8ff 0%, #f8fafc 100%);
    color: #10233f;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .gov-dashboard-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px 18px;
    border-bottom: 1px solid #e6edf8;
    background: rgba(255,255,255,0.86);
    backdrop-filter: blur(12px);
  }

  .gov-dashboard-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .gov-dashboard-brand-mark {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #173e7a 0%, #2d6cdf 100%);
    color: #fff;
    box-shadow: 0 10px 30px rgba(23, 62, 122, 0.16);
  }

  .gov-dashboard-brand h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.4px;
  }

  .gov-dashboard-eyebrow {
    margin: 0 0 3px;
    color: #5b6d86;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.26em;
    text-transform: uppercase;
  }

  .gov-dashboard-topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .gov-dashboard-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border: 1px solid #dfe8f5;
    border-radius: 999px;
    background: #fff;
    color: #27548e;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .gov-dashboard-avatar {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #e8f0ff;
    color: #245398;
    font-weight: 800;
  }

  .gov-dashboard-content {
    width: min(100% - 40px, 1380px);
    margin: 0 auto;
    padding: 30px 0 48px;
  }

  .gov-dashboard-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 28px 28px 24px;
    border-radius: 24px;
    background: linear-gradient(120deg, #12335d 0%, #2259aa 100%);
    color: #fff;
    box-shadow: 0 22px 45px rgba(17, 61, 126, 0.16);
  }

  .gov-dashboard-hero h2 {
    margin: 0 0 8px;
    font-size: 24px;
    line-height: 1.25;
    letter-spacing: -0.5px;
  }

  .gov-dashboard-hero-copy {
    margin: 0;
    max-width: 620px;
    color: rgba(255,255,255,0.84);
    font-size: 15px;
    line-height: 1.65;
  }

  .gov-dashboard-hero-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .gov-dashboard-primary-btn,
  .gov-dashboard-secondary-btn {
    padding: 11px 16px;
    border-radius: 999px;
    border: 0;
    cursor: pointer;
    font-weight: 700;
  }

  .gov-dashboard-primary-btn {
    background: #fff;
    color: #164677;
  }

  .gov-dashboard-secondary-btn {
    background: rgba(255,255,255,0.12);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.22);
  }

  .gov-dashboard-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 18px;
  }

  .gov-dashboard-metric {
    padding: 18px 20px;
    border: 1px solid #e4ebf7;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 12px 30px rgba(15, 33, 58, 0.05);
  }

  .gov-dashboard-metric-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .gov-dashboard-metric-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #16253d;
  }

  .gov-dashboard-metric-change {
    font-size: 12px;
    font-weight: 800;
    color: #2b7b53;
  }

  .gov-dashboard-metric p {
    margin: 8px 0 0;
    color: #60708a;
    font-size: 13px;
    font-weight: 600;
  }

  .gov-dashboard-metric--blue .gov-dashboard-metric-change { color: #2063c2; }
  .gov-dashboard-metric--amber .gov-dashboard-metric-change { color: #b76710; }
  .gov-dashboard-metric--green .gov-dashboard-metric-change { color: #2b7b53; }
  .gov-dashboard-metric--violet .gov-dashboard-metric-change { color: #6d30b4; }

  .gov-dashboard-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 16px;
    margin-top: 16px;
  }

  .gov-dashboard-card {
    padding: 20px;
    border: 1px solid #e4ebf7;
    border-radius: 22px;
    background: #fff;
    box-shadow: 0 14px 28px rgba(15, 33, 58, 0.05);
  }

  .gov-dashboard-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  .gov-dashboard-card-header h3 {
    margin: 0;
    font-size: 17px;
    color: #16253d;
  }

  .gov-dashboard-pill {
    display: inline-flex;
    align-items: center;
    padding: 7px 10px;
    border-radius: 999px;
    background: #ebf2ff;
    color: #1a5bc7;
    font-size: 12px;
    font-weight: 800;
  }

  .gov-dashboard-pill--soft {
    background: #f2f6fb;
    color: #4b617a;
  }

  .gov-dashboard-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gov-dashboard-bar-row {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .gov-dashboard-bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 700;
    color: #4e627c;
  }

  .gov-dashboard-track {
    width: 100%;
    height: 10px;
    border-radius: 999px;
    background: #eef4ff;
    overflow: hidden;
  }

  .gov-dashboard-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #1d70df 0%, #42b1ff 100%);
  }

  .gov-dashboard-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .gov-dashboard-list-item {
    display: flex;
    gap: 10px;
    padding: 12px;
    border-radius: 14px;
    background: #f7faff;
    border: 1px solid #e8eef7;
  }

  .gov-dashboard-list-item strong, .gov-dashboard-report-meta strong {
    display: block;
    color: #18253d;
    font-size: 14px;
    margin-bottom: 3px;
  }

  .gov-dashboard-list-item p, .gov-dashboard-report-meta p {
    margin: 0 0 3px;
    font-size: 13px;
    color: #64758b;
  }

  .gov-dashboard-list-item span {
    display: inline-block;
    margin-top: 4px;
    color: #8092a8;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .gov-dashboard-list-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #fde7ea;
    color: #c5414b;
    flex-shrink: 0;
  }

  .gov-dashboard-list-icon--soft {
    background: #eaf2ff;
    color: #2e67cc;
  }

  .gov-dashboard-table {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .gov-dashboard-table-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border-radius: 14px;
    background: #f7faff;
    border: 1px solid #e8eef7;
  }

  .gov-dashboard-table-row p {
    margin: 3px 0 0;
    color: #64758b;
    font-size: 13px;
  }

  .gov-dashboard-status {
    padding: 8px 10px;
    border-radius: 999px;
    background: #fff2d9;
    color: #b76b12;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .gov-dashboard-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #1f64c9;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
  }

  .gov-dashboard-list-item--compact {
    align-items: center;
    justify-content: space-between;
  }

  .gov-dashboard-report-meta {
    flex: 1;
  }

  @media (max-width: 980px) {
    .gov-dashboard-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .gov-dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .gov-dashboard-topbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 18px 20px;
    }

    .gov-dashboard-content {
      width: min(100% - 24px, 1380px);
      padding-top: 18px;
    }

    .gov-dashboard-hero {
      flex-direction: column;
      align-items: flex-start;
      padding: 22px 20px;
    }

    .gov-dashboard-metrics {
      grid-template-columns: 1fr;
    }

    .gov-dashboard-card {
      padding: 16px;
    }
  }
`;
