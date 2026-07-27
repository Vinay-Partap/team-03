import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, UserCheck, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("citizen");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => {
    if (token && user) {
      toast.success("Account created successfully!");
      const timer = setTimeout(() => navigate("/dashboard"), 700);
      return () => clearTimeout(timer);
    }
  }, [token, user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) return toast.error("Please complete all fields");
    dispatch(registerUser({ name: name.trim(), email: email.trim(), password, role }));
  };
  const inputClass = "w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm";

  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 max-h-[calc(100dvh-11rem)] overflow-y-auto rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
    <Toaster position="top-right" />
    <div className="text-center mb-5"><h2 className="text-2xl font-extrabold text-white">Create your account</h2><p className="mt-1 text-sm text-slate-400">Start with the essentials. Complete your eligibility profile later.</p></div>
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-white">Full name<div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="Enter your full name" /></div></label>
      <label className="block text-sm font-semibold text-white">Email address<div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="name@example.com" /></div></label>
      <label className="block text-sm font-semibold text-white">Account type<div className="relative mt-1"><Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} appearance-none`}><option value="citizen">Citizen</option><option value="researcher">Researcher</option><option value="organization">Organization</option></select></div><span className="mt-1 block text-xs font-normal text-slate-400">Government official and administrator accounts are verified by an administrator.</span></label>
      <label className="block text-sm font-semibold text-white">Password<div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type={showPassword ? "text" : "password"} className={`${inputClass} pr-11`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength="8" required placeholder="At least 8 characters" /><button aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
      <motion.button whileTap={{ scale: .99 }} type="submit" disabled={loading} className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50">{loading ? "Creating account..." : <><UserCheck className="h-5 w-5" />Create account</>}</motion.button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-blue-400">Sign in <ArrowRight className="inline h-4 w-4" /></Link></p>
  </motion.div>;
}
