import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import policyService from "../../services/policy.service";
import userService from "../../services/user.service";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { Search as SearchIcon, Filter, Bookmark, Award, FileText, ArrowLeftRight, ArrowRight } from "lucide-react";

export default function Search() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isSchemesMode = location.pathname.includes("schemes");

  // Tab management
  const [activeTab, setActiveTab] = useState(isSchemesMode ? "schemes" : "policies");

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [state, setState] = useState("");
  const [ministry, setMinistry] = useState(""); const [sector, setSector] = useState(""); const [publicationFrom, setPublicationFrom] = useState(""); const [publicationTo, setPublicationTo] = useState(""); const [effectiveFrom, setEffectiveFrom] = useState(""); const [effectiveTo, setEffectiveTo] = useState(""); const [deadlineFrom, setDeadlineFrom] = useState(""); const [deadlineTo, setDeadlineTo] = useState(""); const [status, setStatus] = useState(""); const [sort, setSort] = useState("newest"); const [history, setHistory] = useState([]); const [page, setPage] = useState(1); const [pagination, setPagination] = useState(null);

  const [policies, setPolicies] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [savedPolicies, setSavedPolicies] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync tab with pathname changes
  useEffect(() => {
    setActiveTab(location.pathname.includes("schemes") ? "schemes" : "policies");
  }, [location]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (department) params.department = department;
      if (state) params.state = state; if (ministry) params.ministry = ministry; if(sector)params.sector=sector;if(publicationFrom)params.publicationFrom=publicationFrom;if(publicationTo)params.publicationTo=publicationTo;if(effectiveFrom)params.effectiveFrom=effectiveFrom;if(effectiveTo)params.effectiveTo=effectiveTo;if(deadlineFrom)params.deadlineFrom=deadlineFrom;if(deadlineTo)params.deadlineTo=deadlineTo;if(status)params.status=status;params.sort=sort; params.page = page; params.limit = 12;

      if (activeTab === "policies") {
        const res = await policyService.getPolicies(params);
        setPolicies(res.policies || []); setPagination(res.pagination || null);
      } else {
        const res = await policyService.getSchemes(params);
        setSchemes(res.schemes || []); setPagination(res.pagination || null);
      }
    } catch (err) {
      toast.error("Failed to load list data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await userService.getSavedItems();
      if (res.success) {
        setSavedPolicies(res.savedPolicies.map((p) => p._id));
        setSavedSchemes(res.savedSchemes.map((s) => s._id));
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, category, department, state, ministry, sector, publicationFrom, publicationTo, effectiveFrom, effectiveTo, deadlineFrom, deadlineTo, status, sort, page]);

  useEffect(() => {
    fetchSaved();
    userService.getSearchHistory().then(r=>setHistory(r.searchHistory||[])).catch(()=>{});
    // Load local compare list
    const savedCompare = localStorage.getItem("compareList");
    if (savedCompare) setCompareList(JSON.parse(savedCompare));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
    // Save to user search history if search string isn't empty
    if (search.trim()) {
      userService.addSearchQuery(search.trim()).catch(() => {});
    }
  };

  const handleBookmark = async (id, isPolicy) => {
    try {
      if (isPolicy) {
        const isSaved = savedPolicies.includes(id);
        if (isSaved) {
          await userService.unsavePolicy(id);
          setSavedPolicies(savedPolicies.filter((pid) => pid !== id));
          toast.success("Policy removed from saved bookmarks");
        } else {
          await userService.savePolicy(id);
          setSavedPolicies([...savedPolicies, id]);
          toast.success("Policy bookmarked successfully");
        }
      } else {
        const isSaved = savedSchemes.includes(id);
        if (isSaved) {
          await userService.unsaveScheme(id);
          setSavedSchemes(savedSchemes.filter((sid) => sid !== id));
          toast.success("Scheme removed from saved bookmarks");
        } else {
          await userService.saveScheme(id);
          setSavedSchemes([...savedSchemes, id]);
          toast.success("Scheme bookmarked successfully");
        }
      }
    } catch (err) {
      toast.error("Failed to update bookmark parameters");
    }
  };

  const toggleCompare = (item, isPolicy) => {
    const compareItem = {
      _id: item._id,
      title: item.title,
      category: item.category,
      department: item.department,
      benefits: item.benefits,
      applicationProcess: item.applicationProcess,
      eligibilityRules: item.eligibilityRules,
      type: isPolicy ? "policy" : "scheme",
    };

    let updatedList = [...compareList];
    const existsIndex = compareList.findIndex((x) => x._id === item._id);

    if (existsIndex > -1) {
      updatedList.splice(existsIndex, 1);
      toast.success("Removed from comparison list");
    } else {
      if (compareList.length >= 3) {
        return toast.error("You can compare up to 3 items at a time");
      }
      updatedList.push(compareItem);
      toast.success("Added to comparison list");
    }

    setCompareList(updatedList);
    localStorage.setItem("compareList", JSON.stringify(updatedList));
  };

  const categories = ["Healthcare", "Education", "Agriculture", "Finance", "Social Welfare", "Employment", "Housing"];
  const departments = ["Department of Health", "Department of Education", "Ministry of Agriculture", "Ministry of Finance", "Ministry of Social Justice"];
  const states = ["Global", "Bihar", "Uttar Pradesh", "Maharashtra", "Tamil Nadu", "Karnataka", "Delhi"];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">
          Search Government {activeTab}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore policies and scheme eligibility parameters. Select multiple items to compare benefits.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <Link
          to="/policies"
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "policies"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("policies")}
        >
          Policies
        </Link>
        <Link
          to="/schemes"
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "schemes"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("schemes")}
        >
          Welfare Schemes
        </Link>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by keyword...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Search</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Residency State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            >
              <option value="">All States / Global</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        <div><label className="block text-xs font-bold text-slate-400 mb-1">Ministry</label><input value={ministry} onChange={e=>{setMinistry(e.target.value);setPage(1)}} placeholder="All Ministries" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"/></div><div><label className="block text-xs font-bold text-slate-400 mb-1">Sector</label><input value={sector} onChange={e=>{setSector(e.target.value);setPage(1)}} placeholder="All Sectors" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"/></div><div><label className="block text-xs font-bold text-slate-400 mb-1">Published From</label><input type="date" value={publicationFrom} onChange={e=>setPublicationFrom(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"/></div><div><label className="block text-xs font-bold text-slate-400 mb-1">Published To</label><input type="date" value={publicationTo} onChange={e=>setPublicationTo(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"/></div><button onClick={()=>{setCategory("");setDepartment("");setState("");setMinistry("");setSector("");setPublicationFrom("");setPublicationTo("");setPage(1)}} className="text-xs font-bold text-blue-600">Reset filters</button></div>
      </div>

      <div className="flex flex-wrap gap-3"><select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="updated">Recently Updated</option><option value="deadline">Deadline</option></select>{["admin","official"].includes(user?.role) && <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs"><option value="">All Statuses</option><option value="draft">Draft</option><option value="pending_approval">Pending Review</option><option value="approved">Approved</option><option value="archived">Archived</option></select>}<input type="date" value={effectiveFrom} onChange={e=>setEffectiveFrom(e.target.value)} className="rounded-xl border border-slate-200 px-2 text-xs" title="Effective from"/><input type="date" value={deadlineTo} onChange={e=>setDeadlineTo(e.target.value)} className="rounded-xl border border-slate-200 px-2 text-xs" title="Deadline to"/></div>
      {history.length>0 && <div className="text-xs text-slate-500">Recent: {history.slice(0,5).map(q=><button key={q} onClick={()=>{setSearch(q);setPage(1)}} className="mr-2 font-semibold text-blue-600">{q}</button>)}</div>}
      {/* Results grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Search Results ({pagination?.total ?? (activeTab === "policies" ? policies.length : schemes.length)})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === "policies"
              ? policies.map((item) => {
                  const isSaved = savedPolicies.includes(item._id);
                  const isComparing = compareList.some((x) => x._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="bg-blue-50 text-blue-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCompare(item, true)}
                              title="Compare Policy"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isComparing ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBookmark(item._id, true)}
                              title="Save Policy"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSaved ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-3">{item.description}</p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{item.department}</span>
                        <Link
                          to={`/policies/${item._id}`}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group/link font-bold text-sm"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              : schemes.map((item) => {
                  const isSaved = savedSchemes.includes(item._id);
                  const isComparing = compareList.some((x) => x._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="bg-purple-50 text-purple-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleCompare(item, false)}
                              title="Compare Scheme"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isComparing ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBookmark(item._id, false)}
                              title="Save Scheme"
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSaved ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-3">{item.description}</p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{item.department}</span>
                        <Link
                          to={`/schemes/${item._id}`}
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-1.5 group/link font-bold text-sm"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
          </div>

          {pagination?.totalPages > 1 && <div className="flex justify-center gap-3"><button disabled={page<=1} onClick={()=>setPage(page-1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button><span className="py-2 text-sm">Page {page} of {pagination.totalPages}</span><button disabled={page>=pagination.totalPages} onClick={()=>setPage(page+1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button></div>}

      {((activeTab === "policies" && policies.length === 0) || (activeTab === "schemes" && schemes.length === 0)) && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-medium">No results found matching your search parameters.</p>
            </div>
          )}
        </div>
      )}
      {pagination && pagination.totalPages > 1 && <div className="flex items-center justify-between text-sm"><button disabled={page<=1} onClick={()=>setPage(page-1)} className="font-bold text-blue-600 disabled:text-slate-300">Previous</button><span className="text-slate-500">Page {pagination.page} of {pagination.totalPages} · {pagination.total} results</span><button disabled={page>=pagination.totalPages} onClick={()=>setPage(page+1)} className="font-bold text-blue-600 disabled:text-slate-300">Next</button></div>}
    </div>
  );
}
