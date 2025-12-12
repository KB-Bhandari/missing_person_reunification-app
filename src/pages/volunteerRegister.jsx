import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, FileText, Calendar, Briefcase, Clock, Shield, Upload } from "lucide-react";

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    // Personal Information
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    
    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Identification
    idType: "aadhar",
    idNumber: "",
    
    // Volunteer Details
    occupation: "",
    skills: [],
    experience: "",
    availability: "weekends",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Additional
    reasonToVolunteer: "",
    termsAccepted: false,
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' or 'error'

  const skillOptions = [
    "Medical Aid",
    "First Aid",
    "Cooking",
    "Teaching",
    "Construction",
    "Logistics",
    "Driving",
    "Communication",
    "Social Work",
    "Technology",
    "Translation",
    "Counseling"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSkillToggle = (skill) => {
    setForm({
      ...form,
      skills: form.skills.includes(skill)
        ? form.skills.filter(s => s !== skill)
        : [...form.skills, skill]
    });
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return form.name && form.email && form.password && form.phone && form.dateOfBirth && form.gender;
      case 2:
        return form.address && form.city && form.state && form.pincode;
      case 3:
        return form.idType && form.idNumber;
      case 4:
        return form.occupation && form.skills.length > 0 && form.availability && form.emergencyContact && form.emergencyPhone;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setMsg("");
    } else {
      setMsg("Please fill all required fields");
      setMsgType("error");
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      setMsg("Please accept the terms and conditions");
      setMsgType("error");
      return;
    }

    if (!form.reasonToVolunteer) {
      setMsg("Please tell us why you want to volunteer");
      setMsgType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/volunteer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "pending", // Set status as pending for admin approval
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("Registration submitted successfully! Your application is pending admin approval. You will be notified via email once approved.");
        setMsgType("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMsg(data.message || "Registration failed");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("Server error. Please try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Volunteer Registration</h1>
          <p className="text-gray-600">Join our relief efforts and make a difference</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Personal</span>
            <span>Address</span>
            <span>ID Proof</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {msg && (
            <div className={`mb-6 p-4 rounded-lg ${
              msgType === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    name="password"
                    type="password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Address Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea
                    name="address"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="House No., Street, Locality"
                    rows="3"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      name="city"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      name="state"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                  <input
                    name="pincode"
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="6-digit PIN code"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: ID Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Identity Verification
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Why we need this:</strong> To ensure the safety and security of our relief operations, we verify the identity of all volunteers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Type *</label>
                  <select
                    name="idType"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.idType}
                    onChange={handleChange}
                    required
                  >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving">Driving License</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number *</label>
                  <input
                    name="idNumber"
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your ID number"
                    value={form.idNumber}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This information will be kept confidential and used only for verification purposes.</p>
                </div>
              </div>
            )}

            {/* Step 4: Volunteer Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                  Volunteer Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                  <input
                    name="occupation"
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your current occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (Select all that apply) *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skillOptions.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                          form.skills.includes(skill)
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="mr-2"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Volunteer Experience</label>
                  <textarea
                    name="experience"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe any previous volunteer experience (optional)"
                    rows="3"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                  <select
                    name="availability"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.availability}
                    onChange={handleChange}
                    required
                  >
                    <option value="weekends">Weekends Only</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="flexible">Flexible</option>
                    <option value="full-time">Full-time</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                    <input
                      name="emergencyContact"
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contact person name"
                      value={form.emergencyContact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone *</label>
                    <input
                      name="emergencyPhone"
                      type="tel"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      value={form.emergencyPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review and Submit */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Application</h3>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-600">Name:</div>
                    <div className="text-gray-800">{form.name}</div>
                    
                    <div className="font-medium text-gray-600">Email:</div>
                    <div className="text-gray-800">{form.email}</div>
                    
                    <div className="font-medium text-gray-600">Phone:</div>
                    <div className="text-gray-800">{form.phone}</div>
                    
                    <div className="font-medium text-gray-600">Location:</div>
                    <div className="text-gray-800">{form.city}, {form.state}</div>
                    
                    <div className="font-medium text-gray-600">ID Type:</div>
                    <div className="text-gray-800">{form.idType.toUpperCase()}</div>
                    
                    <div className="font-medium text-gray-600">Skills:</div>
                    <div className="text-gray-800">{form.skills.join(", ")}</div>
                    
                    <div className="font-medium text-gray-600">Availability:</div>
                    <div className="text-gray-800">{form.availability}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to volunteer? *</label>
                  <textarea
                    name="reasonToVolunteer"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us your motivation to volunteer..."
                    rows="4"
                    value={form.reasonToVolunteer}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Important:</strong> Your application will be reviewed by our admin team. You will receive an email notification once your application is approved or if additional information is needed.
                  </p>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={form.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 mr-3"
                    required
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the terms and conditions and confirm that all information provided is accurate. I understand that providing false information may result in rejection of my application. *
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition"
                >
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
              Already have an account? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegister;