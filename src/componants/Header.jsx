import { Link, useLocation } from "react-router-dom";
import { FaHospital, FaClipboardList, FaUpload, FaChartLine, FaLightbulb, FaUser } from "react-icons/fa";



const Header = () => {
  const location = useLocation();
  const isAuthenticated = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/upload') || 
                          location.pathname.includes('/report') ||
                          location.pathname.includes('/trends') ||
                          location.pathname.includes('/health-tips');

  return (
    <header className="w-full bg-white border-b-2 border-teal-500 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* Logo */}
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition">
        <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
          <FaHospital className="text-2xl" />
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-800">MediLens</span>
          <p className="text-xs text-teal-600">Clinical Analysis Platform</p>
        </div>
      </Link>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === '/dashboard'
                ? 'text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <FaClipboardList /> Dashboard
          </Link>
          <Link
            to="/upload"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === '/upload'
                ? 'text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <FaUpload /> Upload
          </Link>
          <Link
            to="/trends"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === '/trends'
                ? 'text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <FaChartLine /> Trends
          </Link>
          <Link
            to="/health-tips"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === '/health-tips'
                ? 'text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <FaLightbulb /> Health Tips
          </Link>
        </nav>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/upload"
              className="px-5 py-2.5 flex items-center gap-2 text-sm font-bold bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition shadow-md"
            >
              <FaUpload /> Upload Report
            </Link>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
              <FaUser />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-teal-600 transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-bold bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
