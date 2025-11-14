import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [volunteerData, setVolunteerData] = useState({ email: "", password: "" });
  const [familyData, setFamilyData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Volunteer login handler
  const handleVolunteerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/volunteer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Volunteer login successful!");
        navigate("/volunteerDashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during volunteer login");
    }
  };

  // Family login handler
  const handleFamilyLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/family/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(familyData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Family login successful!");
        navigate("/familyDashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during family login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Volunteer Login */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Volunteer Login</h2>
          <form onSubmit={handleVolunteerLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={volunteerData.email}
              onChange={(e) => setVolunteerData({ ...volunteerData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={volunteerData.password}
              onChange={(e) => setVolunteerData({ ...volunteerData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            New Volunteer?{" "}
            <span
              onClick={() => navigate("/volunteerRegister")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create Account
            </span>
          </p>
        </div>

        {/* Family Login */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Family Login</h2>
          <form onSubmit={handleFamilyLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              value={familyData.email}
              onChange={(e) => setFamilyData({ ...familyData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              value={familyData.password}
              onChange={(e) => setFamilyData({ ...familyData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            New Family Member?{" "}
            <span
              onClick={() => navigate("/family_Register")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
