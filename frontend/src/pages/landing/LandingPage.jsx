import { ArrowRight, Users, Landmark, BarChart3, Briefcase, Tractor, FileText, GraduationCap, Search } from 'lucide-react';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col font-['Inter']">
      
      {/* Hero Section */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-8 pt-24 pb-28 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="inline-flex items-center">
            <span className="bg-[#eef4fa] text-[#255694] tracking-wider text-[11px] font-bold px-3 py-1.5 rounded-full uppercase">
              National Policy Registry • 2026
            </span>
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4rem] font-extrabold text-[#0b1e43] leading-[1.1] tracking-tight">
            Every government scheme.<br />
            One trusted place to search it.
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            GovIntel brings together policies, welfare schemes and eligibility rules from every ministry and state department — so citizens, officials and researchers can find, compare and act on them in minutes, not months.
          </p>
          
          <div className="pt-6 w-full max-w-xl">
            <Input 
              icon={<Search className="w-5 h-5" />}
              placeholder='Search "farmer subsidy", "maternity benefit", "education lo...' 
              buttonText="Search"
            />
          </div>
          
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Badge type="default">Agriculture</Badge>
            <Badge type="default">Healthcare</Badge>
            <Badge type="default">Education</Badge>
            <Badge type="default">Housing</Badge>
            <Badge type="default">Employment</Badge>
          </div>
        </div>

        {/* Live Registry Snapshot Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#0b1e43] rounded-[2rem] p-10 shadow-2xl text-white">
            <div className="mb-10">
              <span className="uppercase tracking-widest text-[10px] font-bold text-blue-300">Live Registry Snapshot</span>
              <h2 className="text-2xl font-bold mt-2">All departments, one index</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#152a55] rounded-2xl p-5 border border-white/5">
                <div className="text-[1.75rem] font-bold mb-1">18,420</div>
                <div className="text-xs text-blue-200">Active policies</div>
              </div>
              <div className="bg-[#152a55] rounded-2xl p-5 border border-white/5">
                <div className="text-[1.75rem] font-bold mb-1">3,105</div>
                <div className="text-xs text-blue-200">Public schemes</div>
              </div>
              <div className="bg-[#152a55] rounded-2xl p-5 border border-white/5">
                <div className="text-[1.75rem] font-bold mb-1">92</div>
                <div className="text-xs text-blue-200">Departments linked</div>
              </div>
              <div className="bg-[#152a55] rounded-2xl p-5 border border-white/5">
                <div className="text-[1.75rem] font-bold mb-1">4.6M</div>
                <div className="text-xs text-blue-200">Citizens matched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Band */}
      <section className="bg-[#0b1e43] py-14 w-full text-white">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">18,420+</div>
            <div className="text-sm text-slate-300">Policies indexed</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">3,105</div>
            <div className="text-sm text-slate-300">Welfare schemes</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">36</div>
            <div className="text-sm text-slate-300">States & UTs covered</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.6M+</div>
            <div className="text-sm text-slate-300">Eligibility checks run</div>
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="bg-[#f8fafc] py-24 w-full">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="mb-4">
            <Badge type="featured">Featured</Badge>
          </div>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b1e43]">Widely applied schemes this quarter</h2>
            <button className="hidden md:inline-flex items-center text-[#255694] font-semibold hover:text-[#1a4275] border border-slate-200 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm shadow-sm">
              Browse all schemes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="p-7 border-l-[6px] border-l-[#255694] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#eef4fa] text-[#255694] rounded-xl flex items-center justify-center">
                  <Tractor className="w-6 h-6" />
                </div>
                <Badge type="subtle">Central Scheme</Badge>
              </div>
              <h3 className="text-[1.1rem] font-bold text-[#0b1e43] mb-2">PM Krishi Samman Nidhi</h3>
              <div className="flex items-center text-sm text-slate-500 mb-4 gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Agriculture & Farmers Welfare</span>
              </div>
              <p className="text-slate-600 text-sm mb-12 leading-relaxed">
                Direct income support of ₹6,000/year for landholding farmer families.
              </p>
              <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center text-[13px]">
                <span className="text-slate-400">Updated this quarter</span>
                <a href="#" className="font-semibold text-[#255694] flex items-center hover:underline">
                  View details <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="p-7 border-l-[6px] border-l-[#1f8a70] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#ebf7f4] text-[#1f8a70] rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge type="subtle">Credit Scheme</Badge>
              </div>
              <h3 className="text-[1.1rem] font-bold text-[#0b1e43] mb-2">Kisan Credit Card</h3>
              <div className="flex items-center text-sm text-slate-500 mb-4 gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>Finance · NABARD</span>
              </div>
              <p className="text-slate-600 text-sm mb-12 leading-relaxed">
                Flexible, low-interest credit facility for cultivation and allied needs.
              </p>
              <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center text-[13px]">
                <span className="text-slate-400">Updated this quarter</span>
                <a href="#" className="font-semibold text-[#255694] flex items-center hover:underline">
                  View details <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="p-7 border-l-[6px] border-l-[#255694] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#eef4fa] text-[#255694] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <Badge type="subtle">Education</Badge>
              </div>
              <h3 className="text-[1.1rem] font-bold text-[#0b1e43] mb-2">National Education Loan Scheme</h3>
              <div className="flex items-center text-sm text-slate-500 mb-4 gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Education</span>
              </div>
              <p className="text-slate-600 text-sm mb-12 leading-relaxed">
                Collateral-free loans up to ₹7.5 lakh for higher education.
              </p>
              <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center text-[13px]">
                <span className="text-slate-400">Updated this quarter</span>
                <a href="#" className="font-semibold text-[#255694] flex items-center hover:underline">
                  View details <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audiences / Why GovIntel */}
      <section className="bg-white py-24 w-full">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="mb-4">
            <Badge type="featured">Why GovIntel</Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b1e43] mb-3">Built for every side of public policy</h2>
          <p className="text-slate-600 text-lg max-w-2xl mb-14">
            One verified registry, tailored to how each user actually works with government data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white border border-slate-200 text-[#255694] rounded-xl flex items-center justify-center mb-6">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1e43] mb-3">For citizens</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                Find schemes you actually qualify for, in plain language, without wading through legal text.
              </p>
            </Card>

            <Card className="p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white border border-slate-200 text-[#255694] rounded-xl flex items-center justify-center mb-6">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1e43] mb-3">For officials</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                Track approvals, publish updates and monitor department-wide scheme performance.
              </p>
            </Card>

            <Card className="p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white border border-slate-200 text-[#255694] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1e43] mb-3">For researchers</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                Export structured datasets and compare policy design across states and years.
              </p>
            </Card>

            <Card className="p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white border border-slate-200 text-[#255694] rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1e43] mb-3">For organizations</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                Integrate verified scheme data into CSR planning and beneficiary outreach.
              </p>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}