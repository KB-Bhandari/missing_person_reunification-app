// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/login";
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
          <Route path="/login" element={<Login />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />

          {/* 🔥 Missing Routes Added */}
          <Route path="/volunteer-register" element={<VolunteerRegister />} />
          <Route path="/family-register" element={<FamilyRegister />} />
          <Route path="/missing-info" element={<MissingPersonInfo />} />


        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
