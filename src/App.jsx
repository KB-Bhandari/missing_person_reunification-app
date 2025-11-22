import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VolunteerRegister from "./pages/volunteerRegister";
import FamilyRegister from "./pages/family_Register";
import VolunteerDashboard from "./pages/volunteerDashboard";
import FamilyDashboard from "./pages/FamilyDashboard"; // ✅ Added
import New_Person_Registration from "./pages/RegisterPersonForm";
import HomePage from "./pages/home.jsx";
import AdminVolunteerApproval from "./pages/AdminVolunteerApproval";
import AdminApprove from "./pages/AdminApprove";
import MissingPersonInfo from "./pages/MissingPersonInfo";
import RegisterPerson from "./pages/RegisterPerson";

const App = () => {
  const currentUser = {
    _id: "12345", // Replace with real user state
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteerRegister" element={<VolunteerRegister />} />
          <Route path="/family_Register" element={<FamilyRegister />} />

          {/* Dashboards */}
          <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
          <Route path="/familyDashboard" element={<FamilyDashboard user={currentUser} />} />

          {/* Other Pages */}
          <Route
            path="/newPerson_Registration"
            element={<New_Person_Registration />}
          />
          <Route path="/admin/volunteers" element={<AdminVolunteerApproval />} />
          <Route path="/admin-panel" element={<AdminApprove />} />
          <Route path="/missing-person-info" element={<MissingPersonInfo />} />
          <Route path="/registerNewPerson" element={<RegisterPerson />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
