import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [userType, setUserType] = useState("volunteer"); // volunteer | family
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const apiUrl =
      userType === "volunteer"
        ? "http://localhost:8080/api/volunteer/login"
        : "http://localhost:8080/api/family/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", userType);

        // Navigate based on user type
        navigate(userType === "volunteer" ? "/volunteerDashboard" : "/familyDashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Login 
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setUserType("volunteer")}
            className={`w-1/2 py-2 rounded-lg font-medium ${
              userType === "volunteer"
                ? "bg-blue-600 text-red"
                : "text-red-700 hover:bg-gray-700"
            }`}
          >
            {/* Volunteer Login */}
          </button>
          <button
            onClick={() => setUserType("family")}
            className={`w-1/2 py-2 rounded-lg font-medium ${
              userType === "family"
                ? "bg-blue-600 "
                : "text-red-700 hover:bg-gray-700"
            }`}
          >
            {/* Family Login */}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login as {userType === "volunteer" ? "Volunteer" : "Family Member"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Not registered yet?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
