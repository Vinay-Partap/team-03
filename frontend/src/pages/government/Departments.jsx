import { Landmark, Mail, Phone, MapPin } from "lucide-react";

export default function Departments() {
  const depts = [
    {
      name: "Department of Health & Family Welfare",
      minister: "Dr. A. K. Goel",
      email: "contact.health@gov.in",
      phone: "+91-11-23061234",
      address: "Nirman Bhawan, New Delhi",
      color: "border-blue-500",
    },
    {
      name: "Department of School Education & Literacy",
      minister: "Mrs. Shashi Sharma",
      email: "support.edu@gov.in",
      phone: "+91-11-23383936",
      address: "Shastri Bhawan, New Delhi",
      color: "border-purple-500",
    },
    {
      name: "Ministry of Agriculture & Farmers Welfare",
      minister: "Mr. Rajendra Singh",
      email: "agri.farmer@gov.in",
      phone: "+91-11-23383370",
      address: "Krishi Bhawan, New Delhi",
      color: "border-emerald-500",
    },
    {
      name: "Department of Financial Services",
      minister: "Mr. V. K. Malhotra",
      email: "dfs.contact@gov.in",
      phone: "+91-11-23748721",
      address: "Jeevan Deep Building, New Delhi",
      color: "border-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Landmark className="h-6 w-6 text-emerald-600" />
          <span>Government Ministries & Departments</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review registered ministry directories and verified contact channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {depts.map((d) => (
          <div key={d.name} className={`bg-white rounded-3xl p-6 border-l-4 ${d.color} border border-slate-150 shadow-sm space-y-4`}>
            <div>
              <h3 className="font-extrabold text-slate-850 text-base">{d.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Minister in Charge: {d.minister}</p>
            </div>
            <div className="space-y-2 text-xs text-slate-500 font-semibold">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-450" />
                <span>{d.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-450" />
                <span>{d.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-450" />
                <span>{d.address}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
