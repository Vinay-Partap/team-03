import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast, Toaster } from "react-hot-toast";
import { Lock, Eye, EyeOff, ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import PasswordStrength from "../../components/auth/PasswordStrength";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Reset token is missing from URL query");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters long");

    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. The token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60"
    >
      <Toaster position="top-right" />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-2">Reset Password</h2>
        <p className="text-sm text-slate-500 font-medium">Create a strong new password for your account</p>
      </div>

      {!token ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-4 rounded-xl text-center font-medium">
          Reset token is invalid or missing. Please request a new link from the{" "}
          <Link to="/forgot-password" className="underline font-bold text-slate-900 hover:text-blue-700">Forgot Password</Link> page.
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[54px] pl-12 pr-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <PasswordStrength password={newPassword} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[54px] pl-12 pr-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full h-[56px] flex items-center justify-center gap-2 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              "Resetting..."
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save New Password</span>
              </>
            )}
          </motion.button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-slate-500 font-medium">
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
      </p>
    </motion.div>
  );
}