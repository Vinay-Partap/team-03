import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, Users, UserCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("citizen"); const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch(); const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (token && user) { toast.success("Account registered successfully!"); const timer = setTimeout(() => navigate(user.role === "official" ? "/government/dashboard" : "/dashboard"), 700); return () => clearTimeout(timer); } }, [token, user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);
  const submit = (e) => { e.preventDefault(); if (password !== confirmPassword) return toast.error("Passwords do not match"); dispatch(registerUser({ name, email, password, role })); };
  const input = "w-full h-10 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm";
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px] bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(59,130,246,.08)]">
    <Toaster position="top-right" /><div className="mb-3 text-center"><h2 className="text-2xl font-extrabold text-white">Create your account</h2><p className="mt-1 text-sm text-slate-400">Join GovIntel Platform</p></div>
    <form className="space-y-2" onSubmit={submit}>
      <label className="block text-sm font-semibold text-white">Full Name<div className="relative mt-1"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input required value={name} onChange={e=>setName(e.target.value)} className={input} placeholder="Enter your full name"/></div></label>
      <label className="block text-sm font-semibold text-white">Email Address<div className="relative mt-1"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className={input} placeholder="name@example.com"/></div></label>
      <label className="block text-sm font-semibold text-white">Role<div className="relative mt-1"><Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><select value={role} onChange={e=>setRole(e.target.value)} className={`${input} appearance-none [&>option]:bg-[#0b1329] [&>option]:text-white`}><option value="citizen">Citizen</option><option value="researcher">Researcher</option><option value="organization">Organization</option></select></div></label>
      <label className="block text-sm font-semibold text-white">Password<div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input required minLength="8" type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className={`${input} pr-12`} placeholder="At least 8 characters"/><button aria-label="Show or hide password" type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff className="h-5 w-5"/>:<Eye className="h-5 w-5"/>}</button></div></label>
      <label className="block text-sm font-semibold text-white">Confirm Password<div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input required minLength="8" type={showPassword?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className={input} placeholder="Re-enter your password"/></div></label>
      <motion.button whileTap={{scale:.99}} type="submit" disabled={loading} className="mt-1 w-full h-10 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50">{loading ? "Registering..." : <><UserCheck className="h-5 w-5"/>Create Account</>}</motion.button>
    </form><p className="mt-3 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-blue-400">Login here <ArrowRight className="inline h-4 w-4"/></Link></p>
  </motion.div>;
}
