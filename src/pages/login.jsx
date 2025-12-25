import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("volunteer");
  const [loginData, setLoginData] = useState({ email: "", password: "", secretKey: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let endpoint = "";
    const body = { email: loginData.email, password: loginData.password };

    if (userType === "admin") {
      endpoint = "http://localhost:5000/api/admin/auth/login";
      if (loginData.secretKey) body.secretKey = loginData.secretKey;
    } else if (userType === "family") {
      endpoint = "http://localhost:5000/api/family/login";
    } else if (userType === "volunteer") {
      endpoint = "http://localhost:5000/api/volunteer/login";
    }

    try {
      console.log("Attempting login:", { endpoint, userType });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
          // credentials: "include", 
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", userType);
        
        if (userType === "admin") {
          localStorage.setItem("adminToken", data.token);
        }
      } else {
        console.error("Token missing in server response!");
        setError("Invalid response from server. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Stored - userRole:", localStorage.getItem("userRole"));
      console.log("Stored - token:", !!localStorage.getItem("token"));

      // Dispatch auth change event
      window.dispatchEvent(new Event("auth-change"));
      window.dispatchEvent(new Event("storage"));

      setLoading(false);

      // Small delay to ensure state updates
      setTimeout(() => {
        console.log("Navigating to:", userType);
        // Navigate to dashboard
        if (userType === "admin") {
          navigate("/AdminApprove", { replace: true });
        } else if (userType === "family") {
          navigate("/family-dashboard", { replace: true });
        } else if (userType === "volunteer") {
          navigate("/volunteerDashboard", { replace: true });
        }
      }, 100);

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error during login");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

        {/* User type tabs */}
        <div className="flex justify-between mb-6 bg-gray-200 rounded-lg p-1">
          {["volunteer", "family", "admin"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setUserType(type);
                setError("");
                setLoginData({ email: "", password: "", secretKey: "" });
              }}
              className={`w-1/3 py-2 rounded-lg font-medium transition-all ${
                userType === type ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          {/* Secret key only for admin */}
          {userType === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key (Optional)</label>
              <input
                type="text"
                name="secretKey"
                placeholder="Enter secret key"
                value={loginData.secretKey}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium shadow-md transition-colors ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : userType === "admin" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              if (userType === "volunteer") navigate("/volunteer-register");
              else if (userType === "family") navigate("/family-register");
              else if (userType === "admin") setError("Admin registration requires authorization");
            }}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Register here
          </button>
        </p>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;