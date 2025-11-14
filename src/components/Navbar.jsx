import React, { useState } from "react";
import { Link } from "react-router-dom";
import VolunteerDashboard from "../pages/volunteerDashboard.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg">
            KS
          </div>
          <span className="text-xl font-semibold text-gray-800">
            KhojSetu
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/aboutUs" className="hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </div>

        {/* Login Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            // Close Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md animate-slideDown">
          <div className="flex flex-col space-y-3 px-4 py-3 text-gray-700 font-medium">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/volunteerDashboard"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



