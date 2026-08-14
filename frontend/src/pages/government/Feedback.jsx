import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { MessageSquare, Check, Mail, Clock, ShieldAlert } from "lucide-react";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await userService.getFeedbacks();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (e) {
      toast.error("Failed to load feedbacks database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleTicket = async (id, status) => { try { await userService.updateTicket(id,{status}); toast.success("Ticket updated"); fetchFeedbacks(); } catch { toast.error("Ticket update failed"); } };
  const reply = async (id) => { const message=window.prompt("Public reply to citizen:"); if(message) { await userService.addTicketReply(id,{message,internal:false}); toast.success("Reply sent"); } };

  const handleResolve = async (id) => {
    try {
      await userService.resolveFeedback(id);
      toast.success("Feedback ticket resolved successfully");
      fetchFeedbacks();
    } catch (e) {
      toast.error("Failed to resolve feedback ticket");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          <span>Citizen Feedback & Issues Registry</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review feedback, help desk inquiries, and bug reports posted by citizens.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-2">
          <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-slate-450 font-bold">No feedback entries.</p>
          <p className="text-slate-400 text-xs">Citizen feedback queue is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div
              key={item._id}
              className={`p-6 rounded-3xl border transition-all bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                item.status === "resolved" ? "border-slate-100 opacity-70" : "border-emerald-100"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.type === "issue" ? "bg-red-50 text-red-600" : item.type === "contact" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {item.type}
                  </span>
                  <span className={`text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                    item.status === "resolved" ? "bg-slate-150 text-slate-500" : "bg-orange-50 text-orange-500"
                  }`}>
                    {item.status === "resolved" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    <span>{item.status}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-blue-600">{item.ticketId} · {item.category} · {item.priority}</p>
                <h3 className="font-extrabold text-slate-800 text-base">{item.subject}</h3>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed whitespace-pre-line">{item.message}</p>
                <div className="flex items-center gap-4 text-xxs text-slate-400 font-semibold pt-1">
                  <span>Posted by: {item.name}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {item.email}</span>
                </div>
              </div>
              <div className="flex gap-2"><button onClick={()=>reply(item._id)} className="rounded-xl border px-3 py-2 text-xs font-bold">Reply</button><select value={item.status} onChange={e=>handleTicket(item._id,e.target.value)} className="rounded-xl border px-2 text-xs"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="waiting_for_citizen">Waiting</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></div>
              {item.status === "open" && (
                <button
                  onClick={() => handleResolve(item._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition-all shadow-sm w-full md:w-auto justify-center cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Resolve ticket</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
