import React, { useState } from "react";
import { BASE_URL, API_ENDPOINTS } from "/src/config/api.config";


const RegisterPersonForm = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
  const response = await fetch(`${BASE_URL}/persons`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ Person Registered Successfully!");
      e.target.reset();
      setImagePreview(null);
    } else {
      const data = await response.json();
      alert(`❌ ${data.message || "Failed to register person"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error during registration.");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 transition"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Register Missing Person
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          name="gender"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          name="location"
          placeholder="Last Seen Location"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <textarea
        name="description"
        placeholder="Additional Details"
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setImagePreview(URL.createObjectURL(file));
          }}
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          required
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-300 dark:border-gray-600"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterPersonForm;
