import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";
import { Users, FileText, Database, ShieldAlert, Award, RefreshCw, Layers } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, admin: 0, official: 0, citizen: 0 },
    system: { policies: 0, schemes: 0, feedbacks: 0, openIssues: 0, accountStatus: [], notificationStats: {total:0,unread:0} },
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await userService.getAdminDashboard();
      if (res.success) {
        setStats(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-gradient">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />
            <span>Admin Console Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review active system statistics, global accounts, and logs streams.</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-purple-50 text-purple-600 h-12 w-12 rounded-2xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Registered Users</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.users.total}</h3>
            <p className="text-slate-400 text-xxs mt-0.5">Citizens: {stats.users.citizen} | Officials: {stats.users.official}</p>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">System Directives</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.system.policies}</h3>
          </div>
        </div>

        {/* Schemes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-emerald-50 text-emerald-600 h-12 w-12 rounded-2xl flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Welfare Schemes</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.system.schemes}</h3>
          </div>
        </div>

        {/* Open Feedbacks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-red-50 text-red-500 h-12 w-12 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Open Tickets</p>
            <h3 className="text-2xl font-extrabold text-red-650 mt-1">{stats.system.openIssues}</h3>
            <p className="text-slate-450 text-xxs mt-0.5">Total feedbacks: {stats.system.feedbacks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Logs Stream */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Database className="h-5 w-5 text-purple-600" />
              <span>Live Audit Logs stream</span>
            </h2>
            <Link to="/admin/logs" className="text-xs text-purple-650 font-bold hover:underline">View Database</Link>
          </div>
          <div className="flex-1 space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {stats.recentLogs.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-10">No logs captured yet.</p>
            ) : (
              stats.recentLogs.map((log) => (
                <div key={log._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-start gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">{log.action?.replaceAll("_", " ")}</span>
                    <p className="text-slate-500 mt-1 font-medium">{log.details}</p>
                    <p className="text-slate-400 text-xxs font-semibold mt-0.5">Actor: {log.userId?.name || "Anonymous Guest"}</p>
                  </div>
                  <span className="text-xxs font-semibold text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Utilities Panel */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <span>Access Control Console</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Verify platform accounts, modify official permissions, and review log streams to ensure system integrity.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-6">
            <Link
              to="/admin/users"
              className="bg-purple-600 hover:bg-purple-700 text-white text-center font-bold px-4 py-2.5 rounded-xl text-xs"
            >
              Manage System Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
