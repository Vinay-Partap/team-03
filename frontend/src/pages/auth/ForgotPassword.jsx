import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast, Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please specify your email");
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      toast.success(data.message);
      // Auto-navigate to reset password with simulated token for prototyping convenience
      if (data.token) {
        setTimeout(() => {
          navigate(`/reset-password?token=${data.token}`);
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <h2 className="text-center text-3xl font-extrabold text-white mb-4">Forgot Password</h2>
      <p className="text-center text-sm text-slate-400 mb-6">
        Enter your registered email address and we will generate a simulated reset link for you.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="john@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? "Requesting Link..." : "Generate Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
          Back to Login
        </Link>
      </p>
    </div>
  );
}