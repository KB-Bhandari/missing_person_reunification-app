import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VolunteerRegister from "./pages/volunteerRegister";
import FamilyRegister from "./pages/family_Register";
import VolunteerDashboard from "./pages/volunteerDashboard";
import New_Person_Registration from "./pages/RegisterPersonForm";
import HomePage from "./pages/home.jsx";
import AdminVolunteerApproval from "./pages/AdminVolunteerApproval";
import AdminApprove from "./pages/AdminApprove";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteerRegister" element={<VolunteerRegister />} />
          <Route path="/family_Register" element={<FamilyRegister />} />
          <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
          <Route
            path="/newPerson_Registration"
            element={<New_Person_Registration />}
          />
          <Route path="/admin/volunteers" element={<AdminVolunteerApproval />} />
          <Route path="/admin-panel" element={<AdminApprove />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
