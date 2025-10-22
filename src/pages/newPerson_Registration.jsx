import React, { useState } from "react";
import Navbar from "../components/Navbar";

const New_Person_Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    genderLocation: "",
    campId: "",
    circumstances: "",
    features: "",
    reporterContact: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Person Registered Successfully!");
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl w-full max-w-4xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Register New Person
            </h2>
            <button className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200">
              Logout
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition">
              <label
                htmlFor="photo"
                className="cursor-pointer text-center text-gray-500"
              >
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Uploaded"
                    className="w-40 h-40 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <>
                    <p className="text-sm">Drag & drop photo here or click to upload</p>
                  </>
                )}
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date of Birth / Age
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Gender / Seen Location
                </label>
                <input
                  type="text"
                  name="genderLocation"
                  value={formData.genderLocation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Camp / Area ID
                </label>
                <input
                  type="text"
                  name="campId"
                  value={formData.campId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Circumstances
                </label>
                <textarea
                  name="circumstances"
                  value={formData.circumstances}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-20 resize-none focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Distinguishing Features
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-20 resize-none focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Reporter’s Contact Info
                </label>
                <input
                  type="text"
                  name="reporterContact"
                  value={formData.reporterContact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register Person
              </button>
            </div>
          </form> 
        </div>
      </div>
    </>
  );
};

export default New_Person_Registration;
