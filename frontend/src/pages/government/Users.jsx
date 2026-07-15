import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { Users as UsersIcon, Mail, ShieldAlert, Landmark, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getAllUsers();
        if (data.success) {
          // Filter to show citizens/researchers only (officials read-only view)
          setUsers(data.users || []);
        }
      } catch (e) {
        toast.error("Failed to load user directory");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-emerald-600" />
          <span>Citizen Demographic Directory</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review active citizen profiles, caste category divisions, and state parameters.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Citizen Name</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">State</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 font-semibold">
                      No citizen accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 text-slate-600 h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs">
                            {item.name?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                            <span className="text-xxs font-extrabold text-slate-400 uppercase">{item.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-medium">{item.email}</td>
                      <td className="p-5">
                        <span className="bg-slate-100 text-slate-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                          {item.profile?.category || "General"}
                        </span>
                      </td>
                      <td className="p-5 font-semibold text-xs text-slate-500">{item.profile?.state || "N/A"}</td>
                      <td className="p-5 text-xxs font-semibold text-slate-400">
                        {item.profile?.age ? `Age: ${item.profile.age} | Income: ₹${item.profile.income || 0}` : "Profile parameters not configured"}
                      </td>
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
