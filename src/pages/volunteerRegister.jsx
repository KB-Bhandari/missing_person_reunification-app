import React from "react";

const VolunteerRegister = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-2xl mt-10 p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Volunteer Registration
        </h2>


        <form className="space-y-4">

          <div>
            <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">
    Upload Photo
  </label>

  <label
    className="
      w-28 h-28 
      border-2 border-dashed border-gray-400 
      rounded-lg 
      flex flex-col 
      items-center justify-center 
      cursor-pointer 
      hover:bg-gray-100 transition
    "
  >
    <span className="text-3xl text-gray-600 leading-none">+</span>
    <span className="text-[10px] text-gray-500 mt-1">Choose Photo</span>

    <input type="file" accept="image/*" className="hidden" />
  </label>
</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aadhar Number
            </label>
            <input
              type="number"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your Aadhar Number"
            />
          </div>

          <div>
            <div className="flex flex-col mt-4">
  <label className="text-sm font-medium text-gray-700 mb-1">
    Upload Aadhaar Card
  </label>

  <label
    className="
      w-28 h-28 
      border-2 border-dashed border-gray-400 
      rounded-lg 
      flex flex-col 
      items-center justify-center 
      cursor-pointer 
      hover:bg-gray-100 transition
    "
  >
    <span className="text-3xl text-gray-600 leading-none">+</span>
    <span className="text-[10px] text-gray-500 mt-1">Upload Aadhaar</span>

    <input type="file" accept="image/*,application/pdf" className="hidden" />
  </label>
</div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Volunteer Role
            </label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Select a role</option>
              <option>Field Volunteer</option>
              <option>Online Investigator</option>
              <option>Social Media Helper</option>
              <option>NGO / Police Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience (in years)
            </label>
            <input
              type="number"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0, 1, 2, 3..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City / Area of Availability
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Delhi, Mumbai..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Maharashtra, Delhi..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Register as Volunteer
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegister;