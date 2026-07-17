import { Link } from "react-router-dom";
import { Shield, User, Landmark, BarChart3, Briefcase } from "lucide-react";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Register() {
  const [role, setRole] = useState("citizen");
  const [password, setPassword] = useState("");

  // Simple password strength calculation (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength === 0 && pass.length > 0 ? 1 : strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="w-full max-w-[600px] my-8">
      <Card className="p-8 sm:p-10 border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#153465] rounded-xl flex items-center justify-center mb-5">
            <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-[#0b1e43] mb-2">Create your GovIntel account</h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[320px]">
            Register to search, save and track policies relevant to you
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[#0b1e43]">Full name</label>
            <Input 
              type="text" 
              placeholder="As per government ID" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#0b1e43]">Email address</label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#0b1e43]">Mobile number</label>
              <Input 
                type="tel" 
                placeholder="+91 98XXX XXXXX" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#0b1e43]">Password</label>
              <Input 
                type="password" 
                placeholder="Minimum 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Password Strength Indicator */}
              <div className="flex gap-1.5 mt-2">
                <div className={`h-1 w-full rounded-full transition-colors ${strength >= 1 ? (strength <= 2 ? 'bg-orange-500' : 'bg-[#1f8a70]') : 'bg-slate-200'}`}></div>
                <div className={`h-1 w-full rounded-full transition-colors ${strength >= 2 ? (strength <= 2 ? 'bg-orange-500' : 'bg-[#1f8a70]') : 'bg-slate-200'}`}></div>
                <div className={`h-1 w-full rounded-full transition-colors ${strength >= 3 ? 'bg-[#1f8a70]' : 'bg-slate-200'}`}></div>
                <div className={`h-1 w-full rounded-full transition-colors ${strength >= 4 ? 'bg-[#1f8a70]' : 'bg-slate-200'}`}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#0b1e43]">Confirm password</label>
              <Input 
                type="password" 
                placeholder="Re-enter password" 
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-[13px] font-semibold text-[#0b1e43]">I am registering as</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button 
                type="button"
                onClick={() => setRole("citizen")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${
                  role === "citizen" 
                    ? "border-[#255694] bg-[#eef4fa]" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <User className={`w-5 h-5 mb-3 ${role === "citizen" ? "text-[#255694]" : "text-slate-500"}`} />
                <span className={`text-[14px] font-bold ${role === "citizen" ? "text-[#0b1e43]" : "text-slate-700"}`}>
                  Citizen
                </span>
              </button>

              <button 
                type="button"
                onClick={() => setRole("official")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${
                  role === "official" 
                    ? "border-[#255694] bg-[#eef4fa]" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <Landmark className={`w-5 h-5 mb-3 ${role === "official" ? "text-[#255694]" : "text-slate-500"}`} />
                <span className={`text-[14px] font-bold ${role === "official" ? "text-[#0b1e43]" : "text-slate-700"}`}>
                  Government Official
                </span>
              </button>

              <button 
                type="button"
                onClick={() => setRole("researcher")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${
                  role === "researcher" 
                    ? "border-[#255694] bg-[#eef4fa]" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <BarChart3 className={`w-5 h-5 mb-3 ${role === "researcher" ? "text-[#255694]" : "text-slate-500"}`} />
                <span className={`text-[14px] font-bold ${role === "researcher" ? "text-[#0b1e43]" : "text-slate-700"}`}>
                  Researcher
                </span>
              </button>

              <button 
                type="button"
                onClick={() => setRole("organization")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${
                  role === "organization" 
                    ? "border-[#255694] bg-[#eef4fa]" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <Briefcase className={`w-5 h-5 mb-3 ${role === "organization" ? "text-[#255694]" : "text-slate-500"}`} />
                <span className={`text-[14px] font-bold ${role === "organization" ? "text-[#0b1e43]" : "text-slate-700"}`}>
                  Organization
                </span>
              </button>

            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#255694] focus:ring-[#255694]" />
              <span className="text-[13px] text-slate-600">
                I agree to the <a href="#" className="hover:underline">Terms of Service</a> and <a href="#" className="hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <div className="pt-2">
            <Button variant="primary" className="w-full py-3 text-[15px] font-semibold">
              Create account
            </Button>
          </div>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-slate-600">
            Already registered? <Link to="/login" className="font-semibold text-[#255694] hover:underline">Sign in</Link>
          </p>
        </div>

      </Card>
    </div>
  );
}