import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { toast, Toaster } from "react-hot-toast";
import { Users as UsersIcon, Trash2, Edit2, ShieldCheck, Mail, RefreshCw } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (e) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (e) {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (e) {
      toast.error("Failed to delete user account");
    }
  };

  const rolesList = ["admin", "official", "citizen", "researcher", "organization", "guest"];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-purple-600" />
            <span>Manage Platform Users</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review accounts, update user permissions, and delete user profiles.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">User Details</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Email Address</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Role State</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Profile Status</th>
                  <th className="p-5 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-50 text-purple-650 h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs">
                          {item.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xxs text-slate-400 font-semibold">{item._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-medium">{item.email}</td>
                    <td className="p-5">
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 font-bold px-2 py-1 rounded-lg text-xs"
                      >
                        {rolesList.map((r) => (
                          <option key={r} value={r}>
                            {r.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-xxs font-semibold text-slate-400">
                      {item.profile?.age ? `Age: ${item.profile.age} | State: ${item.profile.state}` : "Profile parameters not configured"}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
