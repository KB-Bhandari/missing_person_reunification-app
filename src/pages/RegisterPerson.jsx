// src/pages/RegisterNewPerson.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterNewPerson = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    photo: null,
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    lastSeenLocation: "",
    circumstances: "",
    distinguishingFeatures: "",
    reporterContact: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = () => {
    // API call or save logic here
    alert("Person Registered Successfully!");
    navigate("/familyDashboard"); // Redirect to dashboard after register
  };

  const handleCancel = () => {
    navigate("/familyDashboard");
  };

  const handleLogout = () => {
    // Clear any auth state if needed
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">
      {/* Header with Logout */}
      <header className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Register New Person</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Form */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Photo Upload */}
          <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Upload Photo</h2>
            <div className="w-full h-64 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4 relative cursor-pointer">
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              {formData.photo ? (
                <p>{formData.photo.name}</p>
              ) : (
                <p>Drag & drop photo here or click to upload</p>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
              Upload Photo
            </button>
          </div>

          {/* Right Column: Person Details */}
          <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Person Details</h2>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              name="lastSeenLocation"
              value={formData.lastSeenLocation}
              onChange={handleChange}
              placeholder="Last Seen Location (Camp/Area ID)"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <textarea
              name="circumstances"
              value={formData.circumstances}
              onChange={handleChange}
              placeholder="Circumstances"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <textarea
              name="distinguishingFeatures"
              value={formData.distinguishingFeatures}
              onChange={handleChange}
              placeholder="Distinguishing Features"
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              name="reporterContact"
              value={formData.reporterContact}
              onChange={handleChange}
              placeholder="Reporter’s Contact Info"
              className="w-full mb-3 p-2 border rounded-lg"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Register Person
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterNewPerson;
