import React from "react";
import { Routes, Route } from "react-router-dom";

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

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
