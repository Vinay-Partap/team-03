export default function Badge({ children, type = 'default', className = '' }) {
  const styles = {
    default: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
    featured: "bg-[#eef4fa] text-[#255694] uppercase tracking-wider text-xs font-bold px-3 py-1",
    subtle: "bg-[#f1f5f9] text-slate-600",
  };

  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-4 py-1.5 ${styles[type]} ${className}`}>
      {children}
    </span>
  );
}
