import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("volunteer");
  const [error, setError] = useState("");

  const [volunteerData, setVolunteerData] = useState({
    email: "",
    password: "",
  });

  const [familyData, setFamilyData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // ============================
  // VOLUNTEER LOGIN
  // ============================
  const handleVolunteerLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/volunteer/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(volunteerData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "volunteer");

      navigate("/volunteerDashboard");
    } catch (err) {
      setError("Server error during volunteer login");
    }
  };

  // ============================
  // FAMILY LOGIN
  // ============================
  const handleFamilyLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/family/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(familyData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "family");
      localStorage.setItem("familyId", data.family._id);

      navigate("/family/dashboard");
    } catch (err) {
      console.log(err);
      setError("Server error during family login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Login
        </h2>

        {/* USER TYPE SWITCH */}
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

        {error && (
          <div className="text-red-600 text-sm mb-3 text-center">{error}</div>
        )}

        {/* VOLUNTEER FORM */}
        {userType === "volunteer" ? (
          <form onSubmit={handleVolunteerLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={volunteerData.email}
              onChange={(e) =>
                setVolunteerData({
                  ...volunteerData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={volunteerData.password}
              onChange={(e) =>
                setVolunteerData({
                  ...volunteerData,
                  password: e.target.value,
                })
              }
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login as Volunteer
            </button>
          </form>
        ) : (
          // FAMILY FORM
          <form onSubmit={handleFamilyLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={familyData.email}
              onChange={(e) =>
                setFamilyData({
                  ...familyData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={familyData.password}
              onChange={(e) =>
                setFamilyData({
                  ...familyData,
                  password: e.target.value,
                })
              }
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login as Family Member
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-sm mt-4">
          Not registered yet?{" "}
          <span
            onClick={() =>
              navigate(
                userType === "volunteer"
                  ? "/volunteerRegister"
                  : "/family_Register"
              )
            }
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Create {userType === "volunteer" ? "Volunteer" : "Family"} Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
