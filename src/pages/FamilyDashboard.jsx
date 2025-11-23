import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    approximate: "",
    approximateAge: "",
    lastSeenLocation: "",
    dateLastSeen: "",
    photo: null,
  });
  const [searchResult, setSearchResult] = useState(null);
  const [foundPerson, setFoundPerson] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(name === "photo" ? { ...formData, photo: files[0] } : { ...formData, [name]: value });
  };

  const handleSearchDetails = () => {
    const person = {
      name: formData.fullName || "Sita Kumari",
      age: "25",
      approxAge: formData.approximateAge || "25-30",
      lastSeen: formData.lastSeenLocation || "Camp-12",
      dateRegistered: formData.dateLastSeen || "2025-11-21",
      caseId: "CASE12345",
      photo: formData.photo ? URL.createObjectURL(formData.photo) : null,
    };
    setFoundPerson(person);
    setSearchResult("Search completed. See information below.");
  };

  const handleSearchPhoto = () => {
    const person = {
      name: "Sita Kumari",
      age: "25",
      approxAge: "25-30",
      lastSeen: "Camp-12",
      dateRegistered: "2025-11-21",
      caseId: "CASE12345",
      photo: formData.photo ? URL.createObjectURL(formData.photo) : null,
    };
    setFoundPerson(person);
    setSearchResult("Search completed. See information below.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <section className="bg-blue-600 text-white py-16 text-center relative">
        <h1 className="text-3xl font-extrabold">Family Dashboard</h1>
        <p className="text-lg mt-2">Search our database of registered missing persons.</p>
        <div className="absolute top-4 right-4">
          <button onClick={() => navigate("/register-new-person")} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
            Register New Person
          </button>
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 mt-10">
        <div className="flex-1 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search by Details</h2>
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full mb-3 p-2 border rounded-lg" />
          <input name="approximate" value={formData.approximate} onChange={handleChange} placeholder="Approximate" className="w-full mb-3 p-2 border rounded-lg" />
          <input name="approximateAge" value={formData.approximateAge} onChange={handleChange} placeholder="Approximate Age" className="w-full mb-3 p-2 border rounded-lg" />
          <input name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} placeholder="Last Seen Location" className="w-full mb-3 p-2 border rounded-lg" />
          <input type="date" name="dateLastSeen" value={formData.dateLastSeen} onChange={handleChange} className="w-full mb-3 p-2 border rounded-lg" />
          <button onClick={handleSearchDetails} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2">Search by Details</button>
        </div>

        <div className="flex-1 p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold mb-4">Search by Photo</h2>
          <div className="w-full h-64 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4 relative cursor-pointer">
            <input type="file" name="photo" onChange={handleChange} className="absolute w-full h-full opacity-0 cursor-pointer" />
            {formData.photo ? <p>{formData.photo.name}</p> : <p>Drag & Drop photo here or click to upload</p>}
          </div>
          <button onClick={handleSearchPhoto} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">Upload Photo & Search</button>
        </div>
      </section>

      {searchResult && <div className="max-w-7xl mx-auto px-4 mt-6 text-center">{searchResult}</div>}

      {foundPerson && (
        <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            {foundPerson.photo ? <img src={foundPerson.photo} alt={foundPerson.name} className="w-48 h-48 object-cover rounded-lg" /> : <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">No Photo</div>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Information for {foundPerson.name}</h2>
            <ul className="space-y-2">
              <li><b>Name:</b> {foundPerson.name}</li>
              <li><b>Age:</b> {foundPerson.age}</li>
              <li><b>Approx. Age:</b> {foundPerson.approxAge}</li>
              <li><b>Last Seen:</b> {foundPerson.lastSeen}</li>
              <li><b>Date Registered:</b> {foundPerson.dateRegistered}</li>
              <li><b>Case ID:</b> {foundPerson.caseId}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyDashboard;
