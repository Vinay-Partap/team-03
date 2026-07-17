import Logo from '../components/ui/Logo';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b1e43] py-16 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Logo light />
            <p className="text-sm text-slate-400 pr-4 leading-relaxed">
              An initiative to make public policy and welfare scheme information transparent, searchable and accessible to every citizen.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Search policies</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Eligibility checker</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Compare schemes</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Users</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Citizens</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Government officials</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Researchers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Organizations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Help center</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact us</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 GovIntel — Government Policy & Public Scheme Intelligence Platform. All rights reserved.</p>
          <p className="mt-4 md:mt-0">An official public-interest digital initiative</p>
        </div>
      </div>
    </footer>
  );
}
