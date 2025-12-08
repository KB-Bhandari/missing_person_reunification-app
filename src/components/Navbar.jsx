import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const profileRef = useRef(null); // <-- Ref for profile dropdown

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("auth-change", updateAuth);
    return () => window.removeEventListener("auth-change", updateAuth);
  }, []);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("volunteerName");
    localStorage.removeItem("volunteerEmail");
    localStorage.removeItem("name");

    setIsLoggedIn(false);
    setProfileOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">
            KS
          </div>
          <span className="text-xl font-semibold text-gray-800">KhojSetu</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/aboutUs">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Profile Dropdown */}
        <div className="hidden md:block relative" ref={profileRef}>
          {isLoggedIn ? (
            <div className="relative">
              <FaUserCircle
                className="text-3xl text-gray-700 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border z-50">
                  {localStorage.getItem("role") === "volunteer" ? (
                    <Link
                      to="/volunteerDashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Volunteer Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/family-dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Family Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/aboutUs" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          {isLoggedIn ? (
            <>
              {localStorage.getItem("role") === "volunteer" ? (
                <Link
                  to="/volunteerDashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block text-blue-600 font-semibold"
                >
                  Volunteer Dashboard
                </Link>
              ) : (
                <Link
                  to="/family-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block text-blue-600 font-semibold"
                >
                  Family Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg block"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
