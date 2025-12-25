import React, { useState, useEffect } from "react";
import axios from "axios";



const FamilyDashboard = () => {
  const [formData, setFormData] = useState({
  fullName: "",
  approximateAge: "",
  gender: "",           // ✅ ADD THIS
  lastSeenLocation: "",
  dateLastSeen: "",
  description: "",
  photo: null,
});


  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [registeredPersons, setRegisteredPersons] = useState([]);
 

  // Fetch registered persons for current session automatically
  useEffect(() => {
    if (activeTab === "case") fetchRegisteredPersons();
  }, [activeTab]);
const fetchRegisteredPersons = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/familySearch/my", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setRegisteredPersons(res.data.familysearches); // already includes matches
    } else {
      setRegisteredPersons([]);
    }
  } catch (err) {
    console.error(err);
    setRegisteredPersons([]);
  }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const { fullName, approximateAge, lastSeenLocation, dateLastSeen, description, photo } = formData;

    if (!fullName || !approximateAge ||  !formData.gender || !lastSeenLocation || !dateLastSeen || !photo) {
      setErrorMsg("All fields except Description are mandatory.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const form = new FormData();
      form.append("name", fullName);
      form.append("approxAge", approximateAge);
      form.append("gender", formData.gender);
      form.append("lastSeenLocation", lastSeenLocation);
      form.append("dateLastSeen", dateLastSeen);
      form.append("description", description || "");
      form.append("photo", photo);
const token = localStorage.getItem("token");

const res = await axios.post(
  "http://localhost:5000/api/familySearch/save",
  form,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      if (!res.data.success) {
        setErrorMsg(res.data.message || "Submission failed.");
        return;
      }

      // Reset form
      setFormData({
        fullName: "",
        approximateAge: "",
        gender: "",
        lastSeenLocation: "",
        dateLastSeen: "",
        description: "",
        photo: null,
      });

      // Refresh Case Management automatically
      fetchRegisteredPersons();
      alert("Missing person report submitted successfully!");
      setActiveTab("case"); // switch to Case Management

    } catch {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="w-full bg-sky-950 text-white py-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl font-semibold">Missing Person Reunification System</h1>
          <p className="mt-2 text-white/80">
            Official portal for submitting missing person details. All information is confidential.
          </p>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-slate-700">
            Dashboard
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${activeTab === "register" ? "bg-slate-700" : "hover:bg-slate-700"}`}
              onClick={() => setActiveTab("register")}
            >
              Register Person
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${activeTab === "case" ? "bg-slate-700" : "hover:bg-slate-700"}`}
              onClick={() => setActiveTab("case")}
            >
              Case Management
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "register" && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Submit Missing Person Details</h2>
              {errorMsg && <p className="text-sm text-red-600 mb-4">{errorMsg}</p>}
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full Name">
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
                </Field>
                <Field label="Approximate Age">
                <input type="number" name="approximateAge" value={formData.approximateAge}  onChange={handleChange}className="input" min="0"
/>

                </Field>
                <Field label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange} required className="input">
                        <option value="">Select Gender</option>
                         <option value="male">Male</option>
                         <option value="female">Female</option>
                          <option value="other">Other</option></select></Field>
                <Field label="Last Seen Location">
                  <input name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} className="input" />
                </Field>
                <Field label="Date Last Seen">
                  <input type="date" name="dateLastSeen" value={formData.dateLastSeen} onChange={handleChange} className="input" />
                </Field>
                <Field label="Description">
                  <textarea name="description" placeholder="Clothes, Height, other Description" value={formData.description} onChange={handleChange} className="input h-28 resize-none md:col-span-2" />
                </Field>
                <Field label="Photograph">
                  <label className="block cursor-pointer w-full">
                    <input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                    <div className="px-4 py-2 border border-slate-300 rounded-md text-center hover:bg-slate-100 transition">
                      {formData.photo ? "Change Photo" : "Upload Photo"}
                    </div>
                  </label>
                  {formData.photo && <p className="text-xs text-slate-500 mt-1 text-center">Selected file: {formData.photo.name}</p>}
                </Field>
              </div>
              <div className="flex justify-center mt-6">
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition font-medium">
                  {loading ? "Submitting…" : "Submit Report"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "case" && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Case Management</h2>
              {registeredPersons.length === 0 ? (
                <p>No persons registered by you yet.</p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {registeredPersons.map((person, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-slate-50 flex gap-4 items-center">
                      <div>
                        {person.photo &&<img
  src={`http://localhost:5000/uploads/familySearch/${person.photo}`}
  alt={person.name}
  className="w-24 h-24 object-cover rounded"
/>
}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <p><strong>Age:</strong> {person.approxAge}</p>
                        <p><strong>Gender:</strong> {person.gender}</p>
                        <p><strong>Last Seen:</strong> {person.lastSeenLocation}</p>
                        <p><strong>Date:</strong> {new Date(person.dateLastSeen).toLocaleDateString()}</p>
                        {person.description && <p><strong>Description:</strong> {person.description}</p>}
                       {person.matches?.length > 0 && (
        <div className="mt-2 p-2 border-t">
          <h4 className="font-semibold">Possible Matches:</h4>
          {person.matches.map((m, i) => (
            <div key={i} className="flex gap-2 items-center mt-1">
              {m.image && <img src={`http://localhost:5000/uploads/foundPersons/${m.image}`} className="w-16 h-16 rounded" />}
              <div>
                <p className="text-sm">{m.name}</p>
                <p className="text-xs text-slate-500">Score: {m.score.toFixed(2)}</p>
                <button className="px-2 py-1 bg-green-600 text-white text-xs rounded">Confirm Match</button>
              </div>
            </div>
          ))}
        </div>
      )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>
        {`
        .input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1px solid #cbd5f5;
          border-radius: 0.375rem;
          font-size: 0.9rem;
        }
        .input:focus {
          outline: none;
          border-color: #0f172a;
          box-shadow: 0 0 0 1px #0f172a;
        }
        `}
      </style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {children}
  </div>
);

export default FamilyDashboard;
