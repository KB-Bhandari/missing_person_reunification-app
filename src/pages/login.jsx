// ...existing code...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("volunteer");
  const [error, setError] = useState("");

  const [volunteerData, setVolunteerData] = useState({ email: "", password: "" });
  const [familyData, setFamilyData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // Volunteer login handler
const handleVolunteerLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const endpoint = "http://localhost:5000/api/volunteer/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: volunteerData.email,
        password: volunteerData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid credentials. Please try again.");
      return;
    }

    // ✅ SAVE VOLUNTEER INFO HERE
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("volunteerName", data.name || "");
    localStorage.setItem("volunteerEmail", data.email || "");
    localStorage.setItem("role", "volunteer");

window.dispatchEvent(new Event("auth-change"));

    // Redirect
    navigate("/volunteerDashboard");
  } catch (err) {
    console.error(err);
    setError("Server error during volunteer login");
  }
};

  // Family login
  const handleFamilyLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = "http://localhost:5000/api/family/login";


      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: familyData.email,
          password: familyData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("role", "family");

      navigate("/family-dashboard");
    } catch (err) {
      setError("Server error during family login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Login</h2>

        {/* Toggle */}
        <div className="flex justify-between mb-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setUserType("volunteer")}
            className={`w-1/2 py-2 rounded-lg font-medium ${userType === "volunteer"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-300"
              }`}
          >
            Volunteer
          </button>

          <button
            onClick={() => setUserType("family")}
            className={`w-1/2 py-2 rounded-lg font-medium ${userType === "family"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-300"
              }`}
          >
            Family
          </button>
        </div>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

        {/* Volunteer login form */}
        {userType === "volunteer" ? (
          <form onSubmit={handleVolunteerLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={volunteerData.email}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={volunteerData.password}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, password: e.target.value })
              }
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login as Volunteer
            </button>
          </form>
        ) : (
          /* Family login form */
          <form onSubmit={handleFamilyLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={familyData.email}
              onChange={(e) =>
                setFamilyData({ ...familyData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={familyData.password}
              onChange={(e) =>
                setFamilyData({ ...familyData, password: e.target.value })
              }
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login as Family Member
            </button>
          </form>
        )}

        {/* Register links */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Not registered yet?{" "}
          {userType === "volunteer" ? (
            <span
              onClick={() => navigate("/volunteer-register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create Volunteer Account
            </span>
          ) : (
            <span
              onClick={() => navigate("/family-register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create Family Member Account
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
// ...existing code...
