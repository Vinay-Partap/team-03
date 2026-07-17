import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

export default function Login() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState(false);

  const handleSSOSubmit = (e) => {
    e.preventDefault();
    setIsSSOLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full max-w-[480px]">
      <Card className="p-8 sm:p-10 border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#153465] rounded-xl flex items-center justify-center mb-5">
            <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-[#0b1e43] mb-2">Sign In to GovIntel</h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
            Access verified policies and schemes with your registered account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0b1e43]">Email address</label>
            <Input 
              type="email" 
              placeholder="you@example.gov.in" 
              icon={<Mail className="w-5 h-5" />} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0b1e43]">Password</label>
            <Input 
              type="password" 
              placeholder="Enter your password" 
              icon={<Lock className="w-5 h-5" />} 
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#255694] focus:ring-[#255694]" />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-[#255694] hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="pt-2">
            <Button variant="primary" type="submit" className="w-full py-3 text-[15px] font-semibold flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Secure Login
            </Button>
          </div>

        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs text-slate-400">or continue with</span>
          </div>
        </div>

        {/* Alternate Login */}
        <Button 
          type="button"
          variant="outline" 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 text-[14px] font-semibold text-slate-700 flex items-center justify-center gap-2"
        >
          DigiLocker / National SSO
        </Button>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-slate-600">
            Don't have an account? <Link to="/register" className="font-semibold text-[#255694] hover:underline">Register here</Link>
          </p>
        </div>

      </Card>

      {/* DigiLocker SSO Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="DigiLocker SSO">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500">
            Sign in using your DigiLocker credentials to securely access GovIntel.
          </p>
        </div>

        <form onSubmit={handleSSOSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0b1e43]">Mobile Number</label>
            <Input 
              type="tel" 
              required
              placeholder="Enter mobile number" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0b1e43]">6 Digit Security PIN</label>
            <Input 
              type="password" 
              required
              maxLength={6}
              placeholder="******" 
            />
          </div>
          <div className="pt-2">
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSSOLoading} 
              className="w-full py-3 text-[15px] font-semibold flex items-center justify-center gap-2 bg-[#1e88e5] hover:bg-[#1976d2] border-none"
            >
              {isSSOLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}