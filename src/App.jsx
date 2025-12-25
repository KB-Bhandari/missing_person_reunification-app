import React, { useState, useEffect }  from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/login";
import AboutUs from "./pages/aboutUs.jsx";
import Contact from "./pages/contact.jsx";
import VolunteerDashboard from "./pages/volunteerDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import HomePage from "./pages/home.jsx";
import VolunteerRegister from "./pages/volunteerRegister";
import FamilyRegister from "./pages/family_Register.jsx";
import MissingPersonInfo from "./pages/missingPersonInfo";
import AdminApprove from "./pages/AdminApprove.jsx";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  // Update state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Function to update auth state (pass to Login component)
  const handleLogin = (newToken, role) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
    setToken(newToken);
    setUserRole(role);
  };

  // Function to logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar token={token} userRole={userRole} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD ROUTES */}
          <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />

          {/* REGISTRATION ROUTES */}
          <Route path="/volunteer-register" element={<VolunteerRegister />} />
          <Route path="/family-register" element={<FamilyRegister />} />

          {/* MISSING PERSON PAGE */}
          <Route path="/missing-info" element={<MissingPersonInfo />} />
          <Route 
            path="/AdminApprove" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminApprove token={token} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;