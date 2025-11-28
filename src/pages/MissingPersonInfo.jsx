// src/pages/missingPersonInfo.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const MissingPersonInfo = () => {
  const location = useLocation();
  const person = location.state?.person;

  if (!person) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-200 text-lg">No information available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-3xl font-extrabold">Missing Person Information</h1>
      </section>

      <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col md:flex-row gap-6">
        {/* Left Side: Photo */}
        <div className="flex-1 flex items-center justify-center">
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              className="w-48 h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
              No Photo
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Information for {person.name}</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li><b>Name:</b> {person.name}</li>
            <li><b>Age:</b> {person.age}</li>
            <li><b>Approx. Age:</b> {person.approxAge}</li>
            <li><b>Last Seen:</b> {person.lastSeen}</li>
            <li><b>Date Registered:</b> {person.dateRegistered}</li>
            <li><b>Case ID:</b> {person.caseId}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MissingPersonInfo;
