import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);

    // 👇 fetch call!
    await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // After submission
    setSubmitted(true);

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Have any questions, feedback, or suggestions?
          We’d love to hear from you.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email address"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write your message here..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Thank you!
            </h2>
            <p className="text-gray-600">
              Your message has been received. We’ll get back to you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-blue-600 hover:underline"
            >
              Send another message
            </button>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="mt-10 text-center text-gray-600">
        <p>📍 Location: Dehradun, Uttarakhand, India</p>
        <p>
          📞 Helpline:{" "}
          <span className="text-blue-600 font-medium">+91 98765 43210</span>
        </p>
        <p>
          ✉️ Email:{" "}
          <span className="text-blue-600 font-medium">
            support@khojsetu.org
          </span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
