import { Outlet, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Soft background glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Branding header above card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-8 text-center z-10"
      >
        <Link to="/" className="flex flex-col items-center group">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-3 shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-blue-500/40 transition-all duration-300">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
            GovIntel Platform
          </h1>
        </Link>
        <p className="text-sm text-slate-400 mt-1 font-medium">Smarter Access to Government Schemes</p>
      </motion.div>

      {/* Main Content Card container */}
      <div className="w-full flex justify-center z-10">
        <Outlet />
      </div>
    </div>
  );
}