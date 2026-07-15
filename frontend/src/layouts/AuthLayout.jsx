import { Outlet, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight mb-4">
          <ShieldCheck className="h-8 w-8 text-blue-500 stroke-[2.5]" />
          <span>GovIntel Platform</span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}