import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ token, userRole, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef(null);

  const isLoggedIn = !!token;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler (use callback from App.jsx)
  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  // Role-based dashboard path
  const getDashboardPath = () => {
    if (userRole === "volunteer") return "/volunteerDashboard";
    if (userRole === "family") return "/family-dashboard";
    if (userRole === "admin") return "/AdminApprove";
    return "/";
  };

  const getDashboardText = () => {
    if (userRole === "volunteer") return "Volunteer Dashboard";
    if (userRole === "family") return "Family Dashboard";
    if (userRole === "admin") return "Admin Panel";
    return "Dashboard";
  };

  // Login button click
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            KS
          </div>
          <span className="text-xl font-semibold text-gray-800">KhojSetu</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/aboutUs" className="hover:text-blue-600 transition">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Desktop Login/Profile */}
        <div className="hidden md:block relative" ref={profileRef}>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="focus:outline-none"
              >
                <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 cursor-pointer transition" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border z-50">
                  <Link
                    to={getDashboardPath()}
                    className="block px-4 py-2 hover:bg-gray-100 font-semibold text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    {getDashboardText()}
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          <Link
            to="/aboutUs"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            Contact
          </Link>

          <div className="pt-2 border-t">
            {isLoggedIn ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-blue-600 font-semibold hover:text-blue-700"
                >
                  {getDashboardText()}
                </Link>

                <button
                  onClick={handleLogoutClick}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-red-700 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
