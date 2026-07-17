import { Search } from 'lucide-react';

export default function Input({ icon, buttonText, onButtonClick, className = '', ...props }) {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute left-4 text-slate-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${buttonText ? 'pr-[100px]' : 'pr-4'} py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#255694] focus:border-transparent shadow-sm ${className}`}
        {...props}
      />
      {buttonText && (
        <button 
          onClick={onButtonClick}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-[#255694] hover:bg-[#1a4275] text-white font-medium rounded-lg transition-colors text-sm"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
