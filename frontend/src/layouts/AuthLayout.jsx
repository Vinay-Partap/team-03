import { Outlet, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <main className="h-screen overflow-hidden bg-[#030712] px-4 py-6 text-white font-sans relative flex flex-col items-center justify-center sm:px-6">
      <div className="absolute top-[-10%] left-[-10%] h-1/2 w-1/2 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-1/2 w-1/2 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="relative z-10 mb-6 text-center">
        <Link to="/" className="flex flex-col items-center group">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,.15)]"><Shield className="h-6 w-6 text-blue-400" /></span>
          <span className="text-2xl font-bold tracking-tight">GovIntel Platform</span>
        </Link>
        <p className="mt-1 text-sm font-medium text-slate-400">Smarter Access to Government Schemes</p>
      </motion.header>
      <section className="relative z-10 flex w-full justify-center"><Outlet /></section>
    </main>
  );
}
