import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "../components/Sidebar";
import RegisterPersonForm from "./RegisterPersonForm";
import { FaUsers, FaUserPlus, FaDatabase, FaSyncAlt } from "react-icons/fa";
import {
  Chart as ChartJS,
          
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { BASE_URL } from "/src/config/api.config";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler);

// ✅ Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const VolunteerDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [stats, setStats] = useState({
    missingPersons: 0,
    matchesFound: 0,
    activeCamps: 0,
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({});
  const [persons, setPersons] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [personRes, dashboardRes, campRes] = await Promise.all([
        fetch(`${BASE_URL}/persons`),
        fetch(`${BASE_URL}/dashboard`),
        fetch(`${BASE_URL}/camps`),
      ]);

      if (!personRes.ok || !dashboardRes.ok || !campRes.ok)
        throw new Error("Failed to fetch data");

      const personsData = await personRes.json();
      const dashboardData = await dashboardRes.json();
      const campsData = await campRes.json();

      setCamps(campsData);
      setPersons(personsData);

      const missing = personsData.filter((p) => p.status === "missing").length;
      const found = personsData.filter((p) => p.status === "found").length;
      const activeCamps = campsData.length;

      setStats({
        missingPersons: missing,
        matchesFound: found,
        activeCamps,
      });
setActivities([
  `Total persons: ${dashboardData.stats?.totalPersons}`,
  `Males: ${dashboardData.stats?.maleCount}`,
  `Females: ${dashboardData.stats?.femaleCount}`,
]);

setChartData({
  labels: ["Male", "Female"],
  datasets: [
    {
      label: "Gender Distribution",
      data: [
        dashboardData.stats?.maleCount || 0,
        dashboardData.stats?.femaleCount || 0
      ],
      borderColor: "rgba(59, 130, 246, 1)",        // Blue line
      backgroundColor: "rgba(59, 130, 246, 0.2)",  // Light fill under line
      borderWidth: 3,                               // Thicker line
      tension: 0.4,                                // Smooth curve
      pointBackgroundColor: "rgba(59, 130, 246, 1)",
      pointRadius: 5,
    }
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#1e293b", // Dark text color
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff"
      }
    },
    scales: {
      x: {
        ticks: { color: "#1e293b" }, // X-axis text color
        grid: { color: "rgba(0,0,0,0.1)" } 
      },
      y: {
        ticks: { color: "#1e293b", stepSize: 1 },
        grid: { color: "rgba(0,0,0,0.1)" } 
      }
    }
  }
});





      setError(null);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Unable to fetch data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main
        className="ml-56 mt-[72px] p-8 w-full min-h-[calc(100vh-72px)] overflow-y-auto bg-gray-100 dark:bg-gray-900"
        style={{ paddingBottom: "100px" }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
            Volunteer Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {user?.name || "Guest"}
            </span>
            <button
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <FaSyncAlt />
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === "Dashboard" && (
          <>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
              <>
                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <MetricCard icon={<FaUsers />} label="Missing Persons" value={stats.missingPersons} color="blue" />
                  <MetricCard icon={<FaUserPlus />} label="Matches Found" value={stats.matchesFound} color="green" />
                  <MetricCard icon={<FaDatabase />} label="Active Camps" value={stats.activeCamps} color="yellow" />
                </div>

                {/* Activities + Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <ActivityList activities={activities} />
                  <QuickActions />
                </div>

                {/* Chart */}
                <div className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-800">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Monthly Registrations vs Matches
                  </h2>
                  <div className="h-72">
                    {chartData.labels?.length ? (
                      <Line data={chartData} />
                    ) : (
                      <p className="text-center text-gray-500">No chart data available</p>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div className="mt-10 p-5 rounded-xl shadow-md bg-white dark:bg-gray-800">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Live Map of Persons & Camps
                  </h2>
                  <MapContainer
                    center={[30.3165, 78.0322]}
                    zoom={8}
                    className="h-[500px] w-full rounded-xl"
                    style={{ zIndex: 0 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {persons
                      .filter((p) => p.latitude && p.longitude)
                      .map((p, i) => (
                        <Marker key={i} position={[p.latitude, p.longitude]}>
                          <Popup>
                            <b>{p.name}</b>
                            <br />Status: {p.status}
                            <br />
                            {p.location}
                          </Popup>
                        </Marker>
                      ))}
                    {camps.map((c, i) => (
                      <Marker key={i} position={[c.latitude, c.longitude]}>
                        <Popup>
                          🏕️ <b>{c.campName}</b>
                          <br />Occupancy: {c.occupied}/{c.capacity}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </>
            )}
          </>
        )}

        {/* Register Person Form */}
        {activeSection === "Register Person" && <RegisterPersonForm />}
        {activeSection === "Case Management" && (
  <CaseManagement persons={persons} fetchDashboardData={fetchDashboardData} />
)}
{activeSection === "Search" && <SearchSection persons={persons} />}
{activeSection === "Reports" && <ReportSection persons={persons} />}
{activeSection === "Settings" && (
  <SettingsSection darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
)}




      </main>
    </div>
  );
};

/* 🧩 Reusable Components */
const MetricCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-400",
    green: "from-green-500 to-green-400",
    yellow: "from-yellow-400 to-yellow-300",
  };
  return (
    <div
      className={`p-5 rounded-xl shadow-md bg-gradient-to-br ${colorMap[color]} text-white transition-transform hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div className="text-4xl opacity-80">{icon}</div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
      <p className="mt-2 font-medium">{label}</p>
    </div>
  );
};

const ActivityList = ({ activities }) => (
  <div className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-800">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
      Recent Activity
    </h2>
    <ul className="space-y-2">
      {activities.length ? (
        activities.map((a, i) => (
          <li key={i} className="border-b pb-2 text-gray-600 dark:text-gray-300 last:border-none">
            {a}
          </li>
        ))
      ) : (
        <p className="text-gray-500">No recent activity.</p>
      )}
    </ul>
  </div>
);

const QuickActions = () => (
  <div className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-800">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
      Quick Actions
    </h2>
    <div className="space-y-3">
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
        Register New Person
      </button>
      <button className="w-full border border-blue-500 text-blue-600 dark:text-blue-300 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition">
        Search Database
      </button>
      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">
        View Reports
      </button>
      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition">
        Manage Camps
      </button>
    </div>
  </div>
);
//case management component
const CaseManagement = ({ persons, fetchDashboardData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/persons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete person");
      alert("Person deleted successfully!");
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error deleting person");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
        Case Management
      </h2>

      {loading && <p className="text-gray-500 dark:text-gray-300 text-center">Processing...</p>}

      {!persons?.length ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No records found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            {persons.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {/* 🖼️ Image */}
                <td className="py-2 px-4">
                  <img
                    src={
                      p.image
                        ? `${BASE_URL.replace("/api", "")}/uploads/${p.image}`
                        : "https://via.placeholder.com/60x60?text=No+Image"
                    }
                    alt={p.name}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-300 dark:border-gray-700"
                  />
                </td>

                <td className="py-2 px-4 font-medium">{p.name}</td>
                <td className="py-2 px-4">{p.age || "—"}</td>
                <td className="py-2 px-4">{p.gender || "—"}</td>

                <td
                  className={`py-2 px-4 font-semibold ${
                    p.status === "missing"
                      ? "text-red-600 dark:text-red-400"
                      : p.status === "found"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {p.status}
                </td>

                <td className="py-2 px-4">{p.location || "—"}</td>

                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
//search section component
const SearchSection = ({ persons }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(persons || []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(persons);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(
        persons.filter(
          (p) =>
            p.name?.toLowerCase().includes(term) ||
            p.status?.toLowerCase().includes(term) ||
            p.location?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, persons]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
        Search Persons
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search by name, status, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition"
          onClick={() => setSearchTerm(searchTerm.trim())}
        >
          Search
        </button>
      </div>

      {/* 📋 Results */}
      {filtered?.length ? (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm p-4 transition hover:shadow-md"
            >
              {/* 🖼️ Image */}
              <img
                src={
                  p.image
                    ? `${BASE_URL.replace("/api", "")}/uploads/${p.image}`
                    : "https://via.placeholder.com/150x150?text=No+Image"
                }
                alt={p.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-1">
                {p.name}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <b>Age:</b> {p.age || "—"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <b>Status:</b>{" "}
                <span
                  className={
                    p.status === "missing"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }
                >
                  {p.status}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <b>Location:</b> {p.location || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No persons found matching your search.
        </p>
      )}
    </div>
  );
};
//report section component 
const ReportSection = ({ persons }) => {
  const total = persons?.length || 0;
  const missing = persons?.filter((p) => p.status === "missing").length || 0;
  const found = persons?.filter((p) => p.status === "found").length || 0;

  const handleExport = () => {
    const csv = persons
      .map((p) => `${p.name},${p.status},${p.location},${p.age}`)
      .join("\n");
    const blob = new Blob([`Name,Status,Location,Age\n${csv}`], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "person_report.csv";
    link.click();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-6 text-blue-700 dark:text-blue-400">
        Reports & Statistics
      </h2>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Total Persons
          </h3>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {total}
          </p>
        </div>

        <div className="bg-red-100 dark:bg-red-800 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Missing
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-300">
            {missing}
          </p>
        </div>

        <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Found
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-300">
            {found}
          </p>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
      >
        Export Report (CSV)
      </button>
    </div>
  );
};
//setting section component
const SettingsSection = ({ user, darkMode, setDarkMode }) => {
  // 🧩 Local states
  const [profile, setProfile] = useState({
    name: user?.name || "Volunteer",
    email: user?.email || "volunteer@example.com",
  });
  const [notifications, setNotifications] = useState(true);
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  // 🗄️ Load from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem("volunteerProfile");
    const storedNotifications = localStorage.getItem("volunteerNotifications");
    const storedDarkMode = localStorage.getItem("volunteerDarkMode");

    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedNotifications) setNotifications(storedNotifications === "true");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  // 💾 Save profile
  const handleSaveProfile = () => {
    localStorage.setItem("volunteerProfile", JSON.stringify(profile));
    alert("✅ Profile updated successfully!");
  };

  // 🔐 Change password (mock)
  const handlePasswordUpdate = () => {
    if (!passwords.old || !passwords.new)
      return alert("⚠️ Please fill both password fields");
    alert("🔒 Password changed successfully!");
    setPasswords({ old: "", new: "" });
  };

  // 🔔 Notification toggle
  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    localStorage.setItem("volunteerNotifications", !notifications);
  };

  // 🌙 Dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("volunteerDarkMode", newMode);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    alert("👋 You have been logged out!");
    window.location.reload();
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } space-y-8`}
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Settings ⚙️</h2>

      {/* 🌙 Appearance */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Appearance</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleDarkModeToggle}
            className="w-5 h-5 text-blue-600"
          />
          <span>Enable Dark Mode</span>
        </label>
      </div>

      {/* 👤 Profile Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Profile</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={(e) =>
              setProfile((p) => ({ ...p, name: e.target.value }))
            }
            className={`border rounded-lg px-3 py-2 w-full ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Full Name"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={(e) =>
              setProfile((p) => ({ ...p, email: e.target.value }))
            }
            className={`border rounded-lg px-3 py-2 w-full ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Email Address"
          />
        </div>
        <button
          onClick={handleSaveProfile}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Save Profile
        </button>
      </div>

      {/* 🔔 Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotificationToggle}
            className="w-5 h-5 text-blue-600"
          />
          <span>Enable Email Alerts for New Reports</span>
        </label>
      </div>

      {/* 🔒 Security */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="password"
            name="old"
            value={passwords.old}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, old: e.target.value }))
            }
            className={`border rounded-lg px-3 py-2 w-full ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Old Password"
          />
          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, new: e.target.value }))
            }
            className={`border rounded-lg px-3 py-2 w-full ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="New Password"
          />
        </div>
        <button
          onClick={handlePasswordUpdate}
          className="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
        >
          Update Password
        </button>
      </div>

      {/* 🚪 Logout */}
      <div className="pt-4 border-t">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};



export default VolunteerDashboard;
