import { motion } from "framer-motion";
import {
  BellRing,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Landmark,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const metrics = [
  { label: "Applied schemes", value: "12", change: "+2 this month", tone: "blue" },
  { label: "Approved", value: "8", change: "66% success", tone: "green" },
  { label: "Pending", value: "4", change: "2 need docs", tone: "amber" },
  { label: "Notifications", value: "3", change: "New updates", tone: "violet" },
];

const schemes = [
  { name: "PM Awas Yojana", status: "Approved", detail: "House allotment confirmed" },
  { name: "Scholarship Support", status: "In review", detail: "Documents verified" },
  { name: "Ration Subsidy", status: "Pending", detail: "Additional income proof needed" },
];

const updates = [
  { title: "New scheme launched", detail: "Skill training benefit available", time: "2 hrs ago" },
  { title: "Appointment reminder", detail: "Document verification on 16 Jul", time: "Today" },
  { title: "Application update", detail: "Your scholarship request moved forward", time: "Yesterday" },
];

export default function CitizenDashboard() {
  return (
    <main className="citizen-dashboard-page">
      <style>{styles}</style>

      <header className="citizen-dashboard-topbar">
        <div className="citizen-dashboard-brand">
          <span className="citizen-dashboard-brand-mark">
            <HeartHandshake size={24} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="citizen-dashboard-eyebrow">Citizen portal</p>
            <h1>Citizen Dashboard</h1>
          </div>
        </div>
        <button className="citizen-dashboard-chip" type="button">
          <BellRing size={16} strokeWidth={2} aria-hidden="true" />
          3 updates
        </button>
      </header>

      <section className="citizen-dashboard-content">
        <motion.div
          className="citizen-dashboard-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <p className="citizen-dashboard-eyebrow">Welcome back</p>
            <h2>Track your applications and stay updated with public services.</h2>
          </div>
          <button className="citizen-dashboard-primary-btn" type="button">
            Check latest schemes
          </button>
        </motion.div>

        <div className="citizen-dashboard-metrics">
          {metrics.map((item, index) => (
            <motion.article
              className={`citizen-dashboard-metric citizen-dashboard-metric--${item.tone}`}
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.06 }}
            >
              <div className="citizen-dashboard-metric-top">
                <span className="citizen-dashboard-metric-value">{item.value}</span>
                <span className="citizen-dashboard-metric-change">{item.change}</span>
              </div>
              <p>{item.label}</p>
            </motion.article>
          ))}
        </div>

        <div className="citizen-dashboard-grid">
          <motion.section
            className="citizen-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.12 }}
          >
            <div className="citizen-dashboard-card-header">
              <div>
                <p className="citizen-dashboard-eyebrow">Applications</p>
                <h3>My schemes</h3>
              </div>
              <span className="citizen-dashboard-pill">Live status</span>
            </div>
            <div className="citizen-dashboard-list">
              {schemes.map((scheme) => (
                <div className="citizen-dashboard-list-item" key={scheme.name}>
                  <div className="citizen-dashboard-list-icon">
                    <CheckCircle2 size={16} strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div className="citizen-dashboard-list-content">
                    <strong>{scheme.name}</strong>
                    <p>{scheme.detail}</p>
                  </div>
                  <span className="citizen-dashboard-status">{scheme.status}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="citizen-dashboard-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.16 }}
          >
            <div className="citizen-dashboard-card-header">
              <div>
                <p className="citizen-dashboard-eyebrow">Updates</p>
                <h3>Recent notifications</h3>
              </div>
            </div>
            <div className="citizen-dashboard-updates">
              {updates.map((item) => (
                <div className="citizen-dashboard-update-item" key={item.title}>
                  <div className="citizen-dashboard-update-icon">
                    <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" />
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
        </div>
      </section>
    </main>
  );
}

const styles = `
  .citizen-dashboard-page { min-height: 100vh; background: #f5fbf8; color: #142c32; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .citizen-dashboard-topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 32px 18px; border-bottom: 1px solid #dfeee7; background: rgba(255,255,255,0.92); }
  .citizen-dashboard-brand { display: flex; align-items: center; gap: 12px; }
  .citizen-dashboard-brand-mark { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #13734d 0%, #2db96d 100%); color: #fff; box-shadow: 0 10px 24px rgba(19, 115, 77, 0.18); }
  .citizen-dashboard-brand h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
  .citizen-dashboard-eyebrow { margin: 0 0 3px; color: #6a7b95; font-size: 11px; font-weight: 800; letter-spacing: 0.28em; text-transform: uppercase; }
  .citizen-dashboard-chip { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #dcefe6; border-radius: 999px; background: #fff; color: #1e8c4e; font-size: 13px; font-weight: 800; cursor: pointer; }
  .citizen-dashboard-content { width: min(100% - 40px, 1280px); margin: 0 auto; padding: 28px 0 46px; }
  .citizen-dashboard-hero { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 26px; border-radius: 24px; background: linear-gradient(120deg, #136140 0%, #25a76b 100%); color: #fff; box-shadow: 0 18px 38px rgba(18, 96, 59, 0.18); }
  .citizen-dashboard-hero h2 { margin: 6px 0 0; font-size: 22px; letter-spacing: -0.4px; }
  .citizen-dashboard-primary-btn { padding: 11px 16px; border: 0; border-radius: 999px; background: #fff; color: #166b41; font-weight: 800; cursor: pointer; }
  .citizen-dashboard-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 16px; }
  .citizen-dashboard-metric { padding: 18px 18px; border-radius: 20px; border: 1px solid #e4efe8; background: #fff; box-shadow: 0 12px 26px rgba(15, 35, 63, 0.05); }
  .citizen-dashboard-metric-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .citizen-dashboard-metric-value { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #142c32; }
  .citizen-dashboard-metric-change { font-size: 12px; font-weight: 800; color: #2b7a53; }
  .citizen-dashboard-metric p { margin: 8px 0 0; color: #61758a; font-size: 13px; font-weight: 700; }
  .citizen-dashboard-metric--blue .citizen-dashboard-metric-change { color: #2468c8; }
  .citizen-dashboard-metric--green .citizen-dashboard-metric-change { color: #2b7a53; }
  .citizen-dashboard-metric--amber .citizen-dashboard-metric-change { color: #af6b12; }
  .citizen-dashboard-metric--violet .citizen-dashboard-metric-change { color: #6e23b2; }
  .citizen-dashboard-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px; margin-top: 16px; }
  .citizen-dashboard-card { padding: 20px; border-radius: 22px; border: 1px solid #e4efe8; background: #fff; box-shadow: 0 12px 24px rgba(15, 35, 63, 0.05); }
  .citizen-dashboard-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .citizen-dashboard-card-header h3 { margin: 0; font-size: 17px; color: #142842; }
  .citizen-dashboard-pill { display: inline-flex; align-items: center; padding: 7px 10px; border-radius: 999px; background: #eaf7ef; color: #198b4e; font-size: 12px; font-weight: 800; }
  .citizen-dashboard-list { display: flex; flex-direction: column; gap: 10px; }
  .citizen-dashboard-list-item { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 14px; background: #f7fcfa; border: 1px solid #e6f2ea; }
  .citizen-dashboard-list-content { flex: 1; }
  .citizen-dashboard-list-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #eaf7ef; color: #249d58; flex-shrink: 0; }
  .citizen-dashboard-list-item strong { display: block; color: #15273e; font-size: 14px; margin-bottom: 3px; }
  .citizen-dashboard-list-item p { margin: 0; color: #64758a; font-size: 13px; }
  .citizen-dashboard-status { padding: 7px 10px; border-radius: 999px; background: #eef9f2; color: #1c8c4d; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
  .citizen-dashboard-updates { display: flex; flex-direction: column; gap: 10px; }
  .citizen-dashboard-update-item { display: flex; gap: 10px; padding: 12px; border-radius: 14px; background: #f7fcfa; border: 1px solid #e6f2ea; }
  .citizen-dashboard-update-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #eaf7ef; color: #1b8a4d; flex-shrink: 0; }
  .citizen-dashboard-update-item strong { display: block; color: #15273e; font-size: 14px; margin-bottom: 3px; }
  .citizen-dashboard-update-item p { margin: 0 0 3px; color: #64758a; font-size: 13px; }
  .citizen-dashboard-update-item span { display: inline-block; color: #94a1b3; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
  @media (max-width: 980px) { .citizen-dashboard-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .citizen-dashboard-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .citizen-dashboard-topbar { flex-direction: column; align-items: flex-start; padding: 18px 20px; } .citizen-dashboard-content { width: min(100% - 24px, 1280px); padding-top: 18px; } .citizen-dashboard-hero { flex-direction: column; align-items: flex-start; padding: 20px; } .citizen-dashboard-metrics { grid-template-columns: 1fr; } }
`;
