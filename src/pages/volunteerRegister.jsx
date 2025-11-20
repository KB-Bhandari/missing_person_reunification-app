import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/volunteer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setMsg("Server error. Try again.");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] relative z-50">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Volunteer Registration
        </h2>

        {msg && <p className="text-center text-red-500 mb-3">{msg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            className="w-full border p-2 rounded mb-3"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            className="w-full border p-2 rounded mb-3"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="w-full border p-2 rounded mb-3"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            name="secretCode"
            type="text"
            className="w-full border p-2 rounded mb-4"
            placeholder="Volunteer Authorization Code"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Register as Volunteer
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegister;
