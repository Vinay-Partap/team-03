import { Shield } from 'lucide-react';

export default function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${light ? 'bg-white/10' : 'bg-[#153465]'}`}>
        <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <span className={`text-xl font-bold leading-tight ${light ? 'text-white' : 'text-[#0d2141]'}`}>
          GovIntel
        </span>
        <span className={`text-[9px] tracking-wider font-bold leading-tight ${light ? 'text-blue-200' : 'text-slate-500'}`}>
          POLICY & SCHEME INTELLIGENCE
        </span>
      </div>
    </div>
  );
}
