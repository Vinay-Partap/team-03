export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#255694] text-white hover:bg-[#1a4275] focus:ring-[#255694]",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} px-4 py-2 text-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
