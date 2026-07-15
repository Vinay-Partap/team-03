import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");

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
    <div className="max-h-[80vh] overflow-y-auto pr-1">
      <Toaster position="top-right" />
      <h2 className="text-center text-3xl font-extrabold text-white mb-6">Create your account</h2>
      <form className="space-y-5 text-slate-300" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="citizen">Citizen (Welfare seeker)</option>
            <option value="official">Government Official</option>
            <option value="researcher">Researcher</option>
            <option value="organization">Organization</option>
            <option value="admin">Platform Administrator</option>
          </select>
        </div>

        {/* Citizen Profile Details */}
        {role === "citizen" && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Citizen Eligibility Profile (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-white"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-white"
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">State Residency</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-white"
                  placeholder="Bihar"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-white"
                  placeholder="Farmer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Education Level</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-white"
                  placeholder="10th Pass"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="disability"
                  checked={disability}
                  onChange={(e) => setDisability(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-slate-800 rounded"
                />
                <label htmlFor="disability" className="text-xs font-semibold text-slate-400">Has Disability</label>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? "Registering..." : "Register Account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
          Login here
        </Link>
      </p>
    </div>
  );
}