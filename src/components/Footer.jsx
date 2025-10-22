import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        
        {/* Left Section */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="font-semibold">KhojSetu</span> — All Rights Reserved.
          </p>
          <p className="text-xs text-gray-500">
            Helping Families Reconnect During Crises
          </p>
        </div>

        {/* Middle Section */}
        <div className="flex space-x-4 text-sm">
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link >
          <Link to="/terms" className="hover:text-blue-600 transition-colors">
            Terms of Use
          </Link >
        </div>

        {/* Right Section */}
        <div className="text-sm">
          <Link to="mailto:support@KhojSetu.org"
            className="hover:text-blue-600 transition-colors"
          >
            support@KhojSetu.org
          </Link >
        </div>
      </div>
    </footer>
  );
};

export default Footer;
