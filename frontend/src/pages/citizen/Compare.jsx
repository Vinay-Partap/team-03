import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, Trash2, ArrowLeft, ShieldCheck, HelpCircle, Award } from "lucide-react";
import policyService from "../../services/policy.service";
import { toast, Toaster } from "react-hot-toast";

export default function Compare() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("compareList");
    if (saved) {
      const cached = JSON.parse(saved); setList(cached);
      Promise.all(cached.map(item => item.type === "policy" ? policyService.getPolicyById(item._id) : policyService.getSchemeById(item._id))).then(items => setList(items.map((r,i)=>({...(r.policy||r.scheme),type:cached[i].type})))).catch(()=>{});
    }
  }, []);

  const handleRemove = (id) => {
    const updated = list.filter((item) => item._id !== id);
    setList(updated);
    localStorage.setItem("compareList", JSON.stringify(updated));
    toast.success("Removed from comparison");
  };

  const handleClear = () => {
    setList([]);
    localStorage.removeItem("compareList");
    toast.success("Comparison list cleared");
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-blue-600" />
            <span>Policy & Scheme Comparison</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare benefits, application steps, and eligibility configurations side-by-side.
          </p>
        </div>
        {list.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear List</span>
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto space-y-4">
          <ArrowLeftRight className="h-12 w-12 text-slate-300 mx-auto" />
          <p className="text-slate-400 font-semibold">Your comparison list is empty.</p>
          <p className="text-slate-400 text-sm">
            Go to the search directories and click the compare icon on policies or schemes to add them here.
          </p>
          <Link
            to="/policies"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
          >
            <span>Search Policies</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider w-1/4">Criteria</th>
                  {list.map((item) => (
                    <th key={item._id} className="p-5 font-bold text-slate-800 w-1/3 relative border-l border-slate-200">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`text-xxs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.type === "policy" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                          }`}>
                            {item.type}
                          </span>
                          <h4 className="font-extrabold text-slate-800 mt-2 text-sm">{item.title}</h4>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {/* Department */}
                <tr>
                  <td className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">Department</td>
                  {list.map((item) => (
                    <td key={item._id} className="p-5 border-l border-slate-200 font-semibold text-slate-700">{item.department}</td>
                  ))}
                </tr>

                {/* Category */}
                <tr>
                  <td className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">Category</td>
                  {list.map((item) => (
                    <td key={item._id} className="p-5 border-l border-slate-200">{item.category}</td>
                  ))}
                </tr>

                {/* Benefits */}
                <tr>
                  <td className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>Benefits</span>
                    </div>
                  </td>
                  {list.map((item) => (
                    <td key={item._id} className="p-5 border-l border-slate-200 leading-relaxed whitespace-pre-line text-xs">{item.benefits || "N/A"}</td>
                  ))}
                </tr>

                {/* Application Process */}
                <tr>
                  <td className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-600" />
                      <span>Application Steps</span>
                    </div>
                  </td>
                  {list.map((item) => (
                    <td key={item._id} className="p-5 border-l border-slate-200 leading-relaxed whitespace-pre-line text-xs">{item.applicationProcess || "N/A"}</td>
                  ))}
                </tr>

                {/* Eligibility Rules */}
                <tr>
                  <td className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                      <span>Eligibility Rules</span>
                    </div>
                  </td>
                  {list.map((item) => (
                    <td key={item._id} className="p-5 border-l border-slate-200 text-xs">
                      {item.type === "scheme" && item.eligibilityRules ? (
                        <div className="space-y-2 text-xxs font-semibold text-slate-500">
                          <div>
                            <span className="text-slate-400">Age Group:</span> {item.eligibilityRules.ageMin || 0} - {item.eligibilityRules.ageMax || 120} yrs
                          </div>
                          <div>
                            <span className="text-slate-400">Gender limit:</span> {item.eligibilityRules.gender || "All"}
                          </div>
                          <div>
                            <span className="text-slate-400">Caste limit:</span> {item.eligibilityRules.category || "All"}
                          </div>
                          <div>
                            <span className="text-slate-400">Max Income limit:</span> {item.eligibilityRules.incomeMax ? `₹${item.eligibilityRules.incomeMax}` : "No Limit"}
                          </div>
                          <div>
                            <span className="text-slate-400">State Limit:</span> {item.eligibilityRules.state || "All"}
                          </div>
                          <div>
                            <span className="text-slate-400">Occupation Limit:</span> {item.eligibilityRules.occupation || "All"}
                          </div>
                          <div>
                            <span className="text-slate-400">Disability limit:</span> {item.eligibilityRules.disabilityRequired ? "Required" : "Not Required"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No structural filters (Direct policy directive)</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
