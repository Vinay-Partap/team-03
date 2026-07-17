import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <Logo />
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="#" className="text-slate-600 hover:text-[#255694] font-medium text-sm transition-colors">Search Policies</Link>
            <Link to="#" className="text-slate-600 hover:text-[#255694] font-medium text-sm transition-colors">Eligibility Checker</Link>
            <Link to="#" className="text-slate-600 hover:text-[#255694] font-medium text-sm transition-colors">Compare Schemes</Link>
            <Link to="#" className="text-slate-600 hover:text-[#255694] font-medium text-sm transition-colors">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
