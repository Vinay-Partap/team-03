import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationRead } from "../../redux/slices/notificationSlice";
import { toast, Toaster } from "react-hot-toast";
import { Bell, Check, Mail, MessageSquare } from "lucide-react";

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id))
      .unwrap()
      .then(() => toast.success("Marked alert as read"))
      .catch(() => toast.error("Failed to update alert"));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <span>My Notifications</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Stay updated with deadlines, new policies, and welfare announcements.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-semibold text-center">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
          <Bell className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-slate-400 font-semibold">All caught up! No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                item.read ? "bg-slate-50 border-slate-200/60" : "bg-white border-blue-100 shadow-sm relative overflow-hidden"
              }`}
            >
              {!item.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              )}
              <div className={`p-2.5 rounded-xl ${item.read ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"}`}>
                {item.type === "new_policy" ? <MessageSquare className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">
                      {item.type?.replace("_", " ")}
                    </span>
                    <h3 className={`font-bold text-slate-800 text-sm mt-0.5 ${item.read ? "text-slate-600" : ""}`}>
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xxs text-slate-400 font-semibold">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{item.message}</p>
                {!item.read && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleMarkRead(item._id)}
                      className="text-xxs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3" />
                      <span>Mark Read</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
