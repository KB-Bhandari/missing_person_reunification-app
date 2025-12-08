import React, { useState } from "react";

const FamilyRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    relation: "",
    address: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/family/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        alert("Family registered successfully!");
      }
    } catch (err) {
      console.log(err);
      setMsg("Server error!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-2xl mt-10 p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Family Registration
        </h2>

        {msg && <p className="text-center text-red-500">{msg}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Family Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            name="relation"
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Relation (Father/Mother/Guardian)"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            placeholder="Address"
            rows="3"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Register Family
          </button>
        </form>
      </div>
    </div>
  );
};

export default FamilyRegister;
