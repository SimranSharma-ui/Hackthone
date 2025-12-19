import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaClipboardList,
  FaUpload,
  FaChartLine,
  FaLightbulb,
  FaUser,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const location = useLocation();
  const isAuthenticated =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/upload") ||
    location.pathname.includes("/report") ||
    location.pathname.includes("/trends") ||
    location.pathname.includes("/health-tips");

  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setShowMenu(false); // Close dropdown on logout
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b-2 border-[#7faaca] shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center hover:opacity-80 transition"
      >
        <img
          src="/logo.png"
          alt="MediLens Logo"
          className="h-16 w-auto object-contain"
        />

        <div className="leading-tight">
          <span className="text-2xl font-bold text-[#156669]">MediLens</span>
          <p className="text-xs text-[#7faac8]">Clinical Analysis Platform</p>
        </div>
      </Link>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === "/dashboard"
                ? "text-[#7faaca]"
                : "text-gray-600 hover:text-[#7faaca]"
            }`}
          >
            <FaClipboardList /> Dashboard
          </Link>
          <Link
            to="/upload"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === "/upload"
                ? "text-[#7faaca]"
                : "text-gray-600 hover:text-[#7faaca]"
            }`}
          >
            <FaUpload /> Upload
          </Link>
          <Link
            to="/trends"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === "/trends"
                ? "text-[#7faaca]"
                : "text-gray-600 hover:text-[#7faaca]"
            }`}
          >
            <FaChartLine /> Trends
          </Link>
          <Link
            to="/health-tips"
            className={`font-semibold transition flex items-center gap-2 ${
              location.pathname === "/health-tips"
                ? "text-[#7faaca]"
                : "text-gray-600 hover:text-[#7faaca]"
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
              className="px-5 py-2.5 flex items-center gap-2 text-sm font-bold bg-[#7faaca] text-white rounded-lg hover:bg-[#7faaca] transition shadow-md"
            >
              <FaUpload /> Upload Report
            </Link>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              >
                <FaUser />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-[#7faaca] hover:text-[#7faaca] transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-bold bg-[#7faaca] text-white rounded-lg hover:bg-[#7faaca] transition shadow-md"
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
