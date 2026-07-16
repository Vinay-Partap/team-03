import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { 
  User, Mail, Lock, Eye, EyeOff, Users, ArrowRight, 
  MapPin, IndianRupee, GraduationCap, Briefcase, Accessibility, UserCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);

  // Profile fields (shown dynamically for citizen role)
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("Farmer");
  const [education, setEducation] = useState("10th Pass");
  const [state, setState] = useState("Bihar");
  const [category, setCategory] = useState("General");
  const [disability, setDisability] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      toast.success("Account registered successfully!");
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "official") {
          navigate("/government/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all basic fields");
    }

    const userData = {
      name,
      email,
      password,
      role,
      profile:
        role === "citizen"
          ? {
              age: age ? Number(age) : null,
              gender,
              income: income ? Number(income) : null,
              occupation,
              education,
              state,
              category,
              disability,
            }
          : {},
    };

    dispatch(registerUser(userData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto bg-[#0b1329]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(59,130,246,0.08)] custom-scrollbar"
    >
      <Toaster position="top-right" />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create your account</h2>
        <p className="text-sm text-slate-400 font-medium">Join thousands of citizens using GovIntel</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[54px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Select Role</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm appearance-none [&>option]:bg-slate-900"
            >
              <option value="citizen">Citizen (Welfare seeker)</option>
              <option value="official">Government Official</option>
              <option value="researcher">Researcher</option>
              <option value="organization">Organization</option>
              <option value="admin">Platform Administrator</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
          </div>
        </div>

        {/* Citizen Profile Details Banner & Form Grid */}
        <AnimatePresence>
          {role === "citizen" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4 pt-4 border-t border-white/10"
            >
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Citizen Eligibility Profile (Optional)</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      placeholder="25"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm appearance-none [&>option]:bg-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Income (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      placeholder="250000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State Residency</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      placeholder="Bihar"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      placeholder="Farmer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Education Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      placeholder="10th Pass"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-[46px] pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm appearance-none [&>option]:bg-slate-900"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="disability"
                    checked={disability}
                    onChange={(e) => setDisability(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-white/20 rounded bg-white/5 focus:ring-offset-slate-900 focus:ring-blue-500"
                  />
                  <label htmlFor="disability" className="text-xs font-semibold text-slate-300 select-none cursor-pointer flex items-center gap-1.5">
                    <Accessibility className="h-4 w-4 text-slate-400" />
                    <span>Has Disability</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full h-[56px] flex items-center justify-center gap-2 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            "Registering..."
          ) : (
            <>
              <UserCheck className="h-5 w-5" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400 font-medium">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group">
          <span>Login here</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </p>
    </motion.div>
  );
}