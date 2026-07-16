import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { Bookmark, Award, FileText, Trash2, ArrowRight } from "lucide-react";

export default function SavedPolicies() {
  const [activeTab, setActiveTab] = useState("policies");
  const [policies, setPolicies] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await userService.getSavedItems();
      if (res.success) {
        setPolicies(res.savedPolicies || []);
        setSchemes(res.savedSchemes || []);
      }
    } catch (err) {
      toast.error("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleUnsave = async (id, isPolicy) => {
    try {
      if (isPolicy) {
        await userService.unsavePolicy(id);
        setPolicies(policies.filter((p) => p._id !== id));
        toast.success("Policy removed from bookmarks");
      } else {
        await userService.unsaveScheme(id);
        setSchemes(schemes.filter((s) => s._id !== id));
        toast.success("Scheme removed from bookmarks");
      }
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-blue-600" />
          <span>My Saved Bookmarks</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review policies and public welfare schemes you have saved for future reference.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === "policies" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Saved Policies ({policies.length})
        </button>
        <button
          onClick={() => setActiveTab("schemes")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === "schemes" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Saved Schemes ({schemes.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === "policies" ? (
        policies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No saved policies.</p>
            <Link to="/policies" className="text-blue-600 font-bold text-sm hover:underline mt-2 inline-block">Browse Policies &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-blue-50 text-blue-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleUnsave(item._id, true)}
                      className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{item.description}</p>
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
            ))}
          </div>
        )
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No saved schemes.</p>
          <Link to="/schemes" className="text-purple-600 font-bold text-sm hover:underline mt-2 inline-block">Browse Schemes &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <span className="bg-purple-50 text-purple-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleUnsave(item._id, false)}
                    className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{item.description}</p>
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
          ))}
        </div>
      )}
    </div>
  );
}
