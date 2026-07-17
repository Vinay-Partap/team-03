import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function MockDigilocker() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2); // Move to OTP/PIN step
    } else {
      setIsLoading(true);
      // Simulate verification delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* DigiLocker Header */}
        <div className="bg-[#1e88e5] p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-3 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-[#1e88e5]" />
          </div>
          <h1 className="text-xl font-bold text-white">DigiLocker SSO</h1>
          <p className="text-blue-100 text-sm mt-1">Sign in to access GovIntel</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSignIn} className="space-y-5">
            
            {step === 1 ? (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Mobile / Aadhaar / Username</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your Aadhaar number" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">6 Digit Security PIN</label>
                <input 
                  type="password" 
                  required
                  maxLength={6}
                  placeholder="******" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent transition-all"
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-[#1e88e5] hover:bg-[#1976d2] text-white font-bold rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : step === 1 ? (
                "Next"
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
              This is a simulated DigiLocker login environment for the GovIntel prototype.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
