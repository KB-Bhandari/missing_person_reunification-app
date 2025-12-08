import React, { useState } from "react";
import axios from "axios";

const FamilyDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    approxAge: "",
    additionalDetails: "",
    lastSeenLocation: "",
    dateLastSeen: "",
    photo: null,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [foundPerson, setFoundPerson] = useState(null);
  const [searchResult, setSearchResult] = useState("");

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(
      name === "photo"
        ? { ...formData, photo: files[0] }
        : { ...formData, [name]: value }
    );
  };

  // SAVE BY DETAILS
  const handleSearchDetails = async () => {
    if (!formData.photo) {
      setErrorMsg("Please upload a photo before submitting details.");
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const form = new FormData();
      form.append("name", formData.name);
      form.append("approxAge", formData.approxAge);
      form.append("additionalDetails", formData.additionalDetails);
      form.append("lastSeenLocation", formData.lastSeenLocation);
      form.append("dateLastSeen", formData.dateLastSeen);
      form.append("photo", formData.photo);

      const res = await axios.post(
        "http://localhost:5000/api/familySearch/saveByDetails",
        form
      );

      if (!res.data.success) {
        setErrorMsg(res.data.message || "Something went wrong.");
        return;
      }

      setSuccessMsg("Details submitted successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error while submitting details.");
    }
  };

  // SAVE BY PHOTO ONLY
  const handleSearchPhoto = async () => {
    if (!formData.photo) {
      setErrorMsg("Please upload a photo.");
      return;
    }

    try {
      setErrorMsg("");
      setSearchResult("");

      const form = new FormData();
      form.append("photo", formData.photo);

      const res = await axios.post(
        "http://localhost:5000/api/familySearch/saveByPhoto",
        form
      );

      if (!res.data.success) {
        setErrorMsg(res.data.message || "Something went wrong.");
        return;
      }

      const r = res.data.data;

      setFoundPerson({
        name: r?.name || "N/A",
        approxAge: r?.approxAge || "N/A",
        additional: r?.additionalDetails || "N/A",
        lastSeen: r?.lastSeenLocation || "N/A",
        dateRegistered: r?.dateLastSeen || "N/A",
        caseId: r?._id,
        photo: r?.photoPath ? `http://localhost:5000${r.photoPath}` : null,
      });

      setSearchResult("Photo submitted successfully");
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error while submitting photo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">

      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-3xl font-extrabold">Family Dashboard</h1>
        <p className="text-lg mt-2">Search our database of registered missing persons.</p>
      </section>

      <section className="flex flex-col max-w-7xl mx-auto px-4 mt-10">

        {/* FORM */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submit Details</h2>

          {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <input
            name="approxAge"
            value={formData.approxAge}
            onChange={handleChange}
            placeholder="Approximate Age"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <textarea
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            placeholder="Additional Details"
            className="w-full mb-3 p-2 border rounded-lg h-24"
          />

          <input
            name="lastSeenLocation"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            placeholder="Last Seen Location"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <input
            type="date"
            name="dateLastSeen"
            value={formData.dateLastSeen}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded-lg"
          />

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
              <p>Drag & Drop photo here or click to upload</p>
            )}
          </div>

          <button
            onClick={handleSearchDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2"
          >
            Submit Details
          </button>

          {/* PHOTO ONLY BUTTON BELOW DETAILS BUTTON */}
          <button
            onClick={handleSearchPhoto}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mt-2"
          >
            Submit Photo Only
          </button>
        </div>
      </section>

      {searchResult && (
        <div className="max-w-7xl mx-auto px-4 mt-6 text-center">{searchResult}</div>
      )}

      {foundPerson && (
        <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            {foundPerson.photo ? (
              <img
                src={foundPerson.photo}
                alt="Person"
                className="w-48 h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">No Photo</div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <ul className="space-y-2">
              <li><b>Name:</b> {foundPerson.name}</li>
              <li><b>Approx Age:</b> {foundPerson.approxAge}</li>
              <li><b>Details:</b> {foundPerson.additional}</li>
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
