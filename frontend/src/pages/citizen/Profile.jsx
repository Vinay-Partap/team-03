import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { User, Mail, ShieldAlert, Award } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.profile?.age !== null ? String(user?.profile?.age) : "");
  const [gender, setGender] = useState(user?.profile?.gender || "Male");
  const [income, setIncome] = useState(user?.profile?.income !== null ? String(user?.profile?.income) : "");
  const [state, setState] = useState(user?.profile?.state || "Bihar");
  const [occupation, setOccupation] = useState(user?.profile?.occupation || "Farmer");
  const [education, setEducation] = useState(user?.profile?.education || "10th Pass");
  const [category, setCategory] = useState(user?.profile?.category || "General");
  const [disability, setDisability] = useState(user?.profile?.disability || false);
  const [officialOrganization, setOfficialOrganization] = useState(user?.officialProfile?.organization || "");
  const [designation, setDesignation] = useState(user?.officialProfile?.designation || "");
  const [organizationName, setOrganizationName] = useState(user?.organizationProfile?.name || "");
  const [organizationType, setOrganizationType] = useState(user?.organizationProfile?.type || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required");

    const payload = {
      name,
      profile:
        user?.role === "citizen"
          ? {
              age: age ? Number(age) : null,
              gender,
              income: income ? Number(income) : null,
              state,
              occupation,
              education,
              category,
              disability,
            }
          : undefined,
      officialProfile: user?.role === "official" ? { organization: officialOrganization, designation } : undefined,
      organizationProfile: user?.role === "organization" ? { name: organizationName, type: organizationType } : undefined,
    };

    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => toast.success("Profile updated successfully"))
      .catch((err) => toast.error(err || "Failed to update profile"));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          <span>My Profile Settings</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal attributes and demographic eligibility parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Card: Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 text-center">
          <div className="bg-blue-600 text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">{user?.name}</h3>
            <p className="text-slate-400 text-xs flex items-center justify-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" /> {user?.email}
            </p>
            <span className="inline-block mt-3 bg-blue-50 text-blue-600 text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Right Card: Editor Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
              />
            </div>

            {user?.role === "official" && <div className="pt-4 border-t border-slate-100 space-y-4"><h3 className="text-sm font-bold text-blue-600 uppercase">Official details</h3><div className="grid grid-cols-2 gap-4"><label className="text-xs font-bold text-slate-400">Government organization<input value={officialOrganization} onChange={e=>setOfficialOrganization(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"/></label><label className="text-xs font-bold text-slate-400">Designation<input value={designation} onChange={e=>setDesignation(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"/></label></div><p className="text-xs text-slate-500">Verification: {user?.accountStatus === "active" ? "Verified" : "Pending verification"}{user?.officialProfile?.verifiedAt ? ` · ${new Date(user.officialProfile.verifiedAt).toLocaleDateString()}` : ""}</p></div>}
            {user?.role === "organization" && <div className="pt-4 border-t border-slate-100 space-y-4"><h3 className="text-sm font-bold text-blue-600 uppercase">Organization details</h3><div className="grid grid-cols-2 gap-4"><label className="text-xs font-bold text-slate-400">Organization name<input value={organizationName} onChange={e=>setOrganizationName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"/></label><label className="text-xs font-bold text-slate-400">Organization type<input value={organizationType} onChange={e=>setOrganizationType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"/></label></div></div>}

            {user?.role === "citizen" && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1 uppercase tracking-wider">
                  <Award className="h-4.5 w-4.5" />
                  <span>Demographic parameters</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="e.g. 25"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="e.g. 150000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">State Residency</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="Bihar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Occupation</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="Farmer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Education Level</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      placeholder="10th Pass"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Social Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
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
                      id="profileDisability"
                      checked={disability}
                      onChange={(e) => setDisability(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-slate-350 text-blue-600"
                    />
                    <label htmlFor="profileDisability" className="text-xs font-bold text-slate-400">
                      Has Disability status
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
