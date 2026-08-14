import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import policyService from "../../services/policy.service";
import userService from "../../services/user.service";
import { Bookmark, Award, ShieldCheck, Bell, ChevronRight, Search, Zap } from "lucide-react";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    savedPoliciesCount: 0,
    savedSchemesCount: 0,
    eligibleSchemesCount: 0,
    recentSearchesCount: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await userService.getCitizenDashboard();
        if (data.success) {
          setStats(data.stats);
          setNotifications(data.notifications || []);
          policyService.checkMyEligibility().then(r=>setRecommendations((r.results||[]).filter(x=>x.isEligible).slice(0,3))).catch(()=>{});
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-gradient">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, {user?.name || "Citizen"}!</h1>
          <p className="text-blue-200 text-sm mt-1.5 font-medium max-w-xl">
            Analyze policy directives, check eligibility rules, and compare public welfare benefits.
          </p>
        </div>
        <Link
          to="/eligibility"
          className="bg-white hover:bg-slate-100 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <Zap className="h-4 w-4 fill-yellow-400 stroke-yellow-500" />
          <span>Check Eligibility</span>
        </Link>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-xl flex items-center justify-center">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Saved Policies</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.savedPoliciesCount}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-purple-50 text-purple-600 h-12 w-12 rounded-xl flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Saved Schemes</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.savedSchemesCount}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-emerald-50 text-emerald-600 h-12 w-12 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Eligible Schemes</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.eligibleSchemesCount}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-slate-50 text-slate-600 h-12 w-12 rounded-xl flex items-center justify-center">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-wider">Recent Searches</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.recentSearchesCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Checker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Your Eligibility Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs font-semibold">Age</span>
                <p className="text-slate-700 font-bold mt-0.5">{user?.profile?.age || "Not Set"} yrs</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs font-semibold">Annual Income</span>
                <p className="text-slate-700 font-bold mt-0.5">
                  {user?.profile?.income ? `₹${user.profile.income}` : "Not Set"}
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs font-semibold">Gender</span>
                <p className="text-slate-700 font-bold mt-0.5">{user?.profile?.gender || "Not Set"}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs font-semibold">State</span>
                <p className="text-slate-700 font-bold mt-0.5">{user?.profile?.state || "Not Set"}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Link to="/profile" className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1">
                <span>Update Profile</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {recommendations.length > 0 && <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"><div className="flex justify-between"><h2 className="text-lg font-bold text-slate-800">Recommended for You</h2><Link to="/eligibility" className="text-sm font-bold text-blue-600">View all</Link></div><div className="mt-4 space-y-3">{recommendations.map(item=><Link key={item.schemeId} to={`/schemes/${item.schemeId}`} className="block rounded-xl bg-emerald-50 p-3"><b className="text-sm text-slate-800">{item.title}</b><span className="float-right text-xs font-bold text-emerald-700">{item.recommendationScore}% match</span><p className="mt-1 text-xs text-slate-600">{item.benefits || "View scheme guidance"}</p></Link>)}</div></div>}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-blue-50/10 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-800">Policy Comparison Tool</h3>
              <p className="text-slate-500 text-sm">
                Select policies and schemes side-by-side to compare eligibility criteria, application steps, and benefits.
              </p>
              <Link to="/compare" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 pt-3">
                <span>Compare Now</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-white to-emerald-50/10 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-800">Welfare Scheme Search</h3>
              <p className="text-slate-500 text-sm">
                Explore welfare schemes categorized by health, agriculture, and educational sectors. Filter by state residency.
              </p>
              <Link to="/schemes" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 pt-3">
                <span>Browse Schemes</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications Sidebar Ticker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span>System Alerts</span>
            </h2>
            <Link to="/notifications" className="text-xs text-blue-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[300px] pr-1">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No notifications found.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    n.read ? "bg-slate-50 border-slate-100 text-slate-600" : "bg-blue-50/30 border-blue-100 text-slate-800 font-medium"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{n.type?.replace("_", " ")}</p>
                  <h4 className="text-sm font-bold mt-1 text-slate-800">{n.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}