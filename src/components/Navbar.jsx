import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

useEffect(() => {
  const updateAuth = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  };

  // Listen for login/logout updates
  window.addEventListener("auth-change", updateAuth);

  return () => window.removeEventListener("auth-change", updateAuth);
}, []);


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("volunteerName");
  localStorage.removeItem("volunteerEmail");
  localStorage.removeItem("name");

  setIsLoggedIn(false);

  // 🔥 Notify Navbar
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

        {/* Login / Logout */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
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
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/aboutUs" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
