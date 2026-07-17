import { Link } from "react-router-dom";
import { Shield, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      // Simulate an API call
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-[480px]">
      <Card className="p-8 sm:p-10 border-slate-200 shadow-sm">
        
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-[#153465] rounded-xl flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold text-[#0b1e43] mb-2">Reset your password</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[320px]">
                Enter your email address and we will send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0b1e43]">Email address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.gov.in" 
                  icon={<Mail className="w-5 h-5" />} 
                  required
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" type="submit" className="w-full py-3 text-[15px] font-semibold">
                  Send reset link
                </Button>
              </div>

            </form>
          </>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#ebf7f4] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#1f8a70]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#0b1e43] mb-3">Check your email</h1>
            <p className="text-slate-500 leading-relaxed max-w-[320px] mb-8">
              We have sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>. Please click the link to create a new password.
            </p>
            <Button 
              variant="outline" 
              className="w-full py-3 text-[15px] font-semibold"
              onClick={() => setIsSubmitted(false)}
            >
              Try a different email
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-[#255694] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sign In
          </Link>
        </div>

      </Card>
    </div>
  );
}