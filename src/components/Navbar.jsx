import React from "react";
import { Link } from "react-router-dom";
import VolunteerDashboard from "../pages/volunteerDashboard.jsx";

const Navbar = () => {
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

        {/* Menu Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="" className="hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link >
        </div>

        {/* Login Button */}
        <div>
          <Link to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link >
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
