import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return <main className="min-h-[100dvh] bg-slate-50 font-sans lg:grid lg:h-[100dvh] lg:grid-cols-5 lg:overflow-hidden">
    <section className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-8 lg:col-span-2 lg:min-h-0 lg:h-full lg:py-5 lg:bg-white lg:px-10 xl:px-16">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 inline-flex items-center gap-2.5 text-slate-950"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"><ShieldCheck className="h-5 w-5" /></span><span className="text-xl font-extrabold tracking-tight">GovIntel</span></Link>
        <Outlet />
      </div>
    </section>
    <section className="relative hidden overflow-hidden bg-[#0b1e4b] lg:col-span-3 lg:flex lg:min-h-0 lg:h-full lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,.45),transparent_38%),radial-gradient(circle_at_75%_75%,rgba(30,64,175,.5),transparent_45%)]" />
      <motion.img initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7}} src="/src/assets/govintel-auth-hero.png" alt="Government intelligence operations center" className="relative z-10 w-[92%] rounded-3xl object-cover shadow-2xl shadow-blue-950/50" />
      <div className="absolute bottom-10 left-12 z-20 max-w-md text-white"><span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"><Sparkles className="h-3.5 w-3.5"/> Government intelligence, simplified</span><h2 className="text-3xl font-bold leading-tight">Make every policy decision more accessible.</h2></div>
    </section>
  </main>;
}
