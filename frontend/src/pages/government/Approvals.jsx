import { useState, useEffect } from "react";
import policyService from "../../services/policy.service";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { CheckSquare, Check, X, FileText, Award, Landmark, User, Calendar } from "lucide-react";

export default function Approvals() {
  const { user } = useSelector((state) => state.auth);
  const [policies, setPolicies] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("policies");

  const fetchPending = async () => {
    setLoading(true);
    try {
      if (activeType === "policies") {
        const res = await policyService.getPolicies({ status: "pending_approval" });
        setPolicies(res.policies || []);
      } else {
        const res = await policyService.getSchemes({ status: "pending_approval" });
        setSchemes(res.schemes || []);
      }
    } catch (e) {
      toast.error("Failed to load approvals queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [activeType]);

  const handleDecision = async (id, action, isPolicy) => {
    try {
      if (isPolicy) {
        if (action === "approve") {
          await policyService.approvePolicy(id);
          toast.success("Policy directive approved and published live!");
        } else {
          const reason = window.prompt("Reason for sending this policy back (optional):") || "";
          await policyService.rejectPolicy(id, reason);
          toast.success("Policy directive sent back to creator drafts");
        }
      } else {
        if (action === "approve") {
          await policyService.approveScheme(id);
          toast.success("Scheme approved and published live!");
        } else {
          const reason = window.prompt("Reason for sending this scheme back (optional):") || "";
          await policyService.rejectScheme(id, reason);
          toast.success("Scheme sent back to creator drafts");
        }
      }
      fetchPending();
    } catch (e) {
      toast.error("Failed to update verification status");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-emerald-600" />
          <span>Workflow Approvals Queue</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review policy drafts and welfare scheme details submitted by colleagues before public release.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveType("policies")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeType === "policies" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Policies Queue
        </button>
        <button
          onClick={() => setActiveType("schemes")}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeType === "schemes" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Schemes Queue
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : activeType === "policies" ? (
        policies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-2">
            <CheckSquare className="h-10 w-10 text-slate-350 mx-auto" />
            <p className="text-slate-450 font-bold">Policy queue is empty!</p>
            <p className="text-slate-400 text-xs">No policy drafts are currently awaiting verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Landmark className="h-3 w-3" />
                      <span>{item.state || "Global"}</span>
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 max-w-2xl">{item.description}</p>
                  <div className="flex items-center gap-4 text-xxs text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Drafted by: {item.createdBy?.name || "Official"}</span>
                    {item.deadline && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {new Date(item.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    disabled={item.createdBy?._id === user?._id} title={item.createdBy?._id === user?._id ? "You cannot approve your own policy" : ""} onClick={() => handleDecision(item._id, "approve", true)}
                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    disabled={item.createdBy?._id === user?._id} onClick={() => handleDecision(item._id, "reject", true)}
                    className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Send Back</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-2">
          <CheckSquare className="h-10 w-10 text-slate-350 mx-auto" />
          <p className="text-slate-450 font-bold">Schemes queue is empty!</p>
          <p className="text-slate-400 text-xs">No scheme drafts are currently awaiting verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schemes.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-50 text-purple-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                    {item.category}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Landmark className="h-3 w-3" />
                    <span>{item.state || "Global"}</span>
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 max-w-2xl">{item.description}</p>
                <div className="flex items-center gap-4 text-xxs text-slate-400 font-semibold pt-1">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Drafted by: {item.createdBy?.name || "Official"}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleDecision(item._id, "approve", false)}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleDecision(item._id, "reject", false)}
                  className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Send Back</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
