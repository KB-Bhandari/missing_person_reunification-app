import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";  
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VolunteerRegister from "./pages/volunteerRegister";
import FamilyRegister from "./pages/family_Register";
import VolunteerDashboard from "./pages/volunteerDashboard";
import New_Person_Registration from "./pages/newPerson_Registration";
import HomePage from "./pages/home.jsx";
const App = () => {
  return (
      <div className="flex flex-col min-h-screen">
      <Navbar /> 

      {/* Main content */}
      <main className="flex-grow">
        {/* Your routes or content here */
        // 
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/volunteerRegister" element={<VolunteerRegister />} />
          <Route path="/family_Register" element={<FamilyRegister />} />
      
          <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
          <Route path="/newPerson_Registration" element={<New_Person_Registration />} />
          <Route path="/" element={<HomePage />} />
          {/* <Route path="*" element={<NotFound />} />  404 */}
        </Routes>
          
        }
      </main>

      <Footer />
    </div>


    
  );
};
export default App;