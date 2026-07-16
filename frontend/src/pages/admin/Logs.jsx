import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { Database, Search, RefreshCw } from "lucide-react";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await userService.getAuditLogs();
      if (data.success) {
        setLogs(data.logs || []);
        setFilteredLogs(data.logs || []);
      }
    } catch (e) {
      toast.error("Failed to load audit logs database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredLogs(logs);
    } else {
      const q = search.toLowerCase();
      const filtered = logs.filter((log) => {
        const actionMatch = log.action?.toLowerCase().includes(q);
        const detailsMatch = log.details?.toLowerCase().includes(q);
        const actorMatch = log.userId?.name?.toLowerCase().includes(q) || log.userId?.email?.toLowerCase().includes(q);
        return actionMatch || detailsMatch || actorMatch;
      });
      setFilteredLogs(filtered);
    }
  }, [search, logs]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="h-6 w-6 text-purple-600" />
            <span>Platform Audit Logs Registry</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Search, trace and review system-wide administrative changes and session events.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter logs by action, details, user or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold uppercase tracking-wider">Timestamp</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Action Type</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Actor</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Log Details</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 font-semibold">
                      No matching log records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-semibold text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-5 font-bold">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-slate-700">{log.userId?.name || "Anonymous Guest"}</p>
                        <p className="text-xxs text-slate-400 mt-0.5">{log.userId?.email || "guest@system"}</p>
                      </td>
                      <td className="p-5 font-medium max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="p-5 font-semibold text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
