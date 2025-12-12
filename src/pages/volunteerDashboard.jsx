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
const IMAGE_BASE_URL = "http://localhost:5000/uploads/foundPersons";

const getImageUrl = (filename) => {
  if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
  
  const cleanFilename = filename.replace(/^\/uploads\/foundPersons\//, '').replace(/^\/uploads\//, '');
  
  return `${IMAGE_BASE_URL}/${cleanFilename}`;
};

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler
);

// Fix Leaflet marker icons (keeps markers working)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const VolunteerDashboard = ({ user }) => {
  const volunteerName = localStorage.getItem("volunteerName") || "Guest";

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [stats, setStats] = useState({
    missingPersons: 0,
    matchesFound: 0,
    activeCamps: 0,
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [persons, setPersons] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personRes, dashboardRes, campRes] = await Promise.all([
        fetch(`${BASE_URL}/persons`),
        fetch(`${BASE_URL}/dashboard`),
        fetch(`${BASE_URL}/camps`),
      ]);

      if (!personRes.ok || !dashboardRes.ok || !campRes.ok) {
        // attempt to parse any returned JSON for more info
        const e1 = await personRes.json().catch(() => null);
        const e2 = await dashboardRes.json().catch(() => null);
        const e3 = await campRes.json().catch(() => null);
        throw new Error(
          `Failed to fetch one or more endpoints. persons:${personRes.status} dashboard:${dashboardRes.status} camps:${campRes.status}`
        );
      }

      const personsData = (await personRes.json()) || [];
      const dashboardData = (await dashboardRes.json()) || { stats: {} };
      const campsData = (await campRes.json()) || [];

      setPersons(personsData);
      setCamps(campsData);

      const missing = personsData.filter((p) => p.status === "missing").length;
      const found = personsData.filter((p) => p.status === "found").length;
      const activeCamps = campsData.length;

      setStats({
        missingPersons: missing,
        matchesFound: found,
        activeCamps,
      });

      setActivities([
        `Total persons: ${dashboardData.stats?.totalPersons ?? personsData.length}`,
        `Males: ${dashboardData.stats?.maleCount ?? 0}`,
        `Females: ${dashboardData.stats?.femaleCount ?? 0}`,
      ]);

      const maleCount = dashboardData.stats?.maleCount ?? 0;
      const femaleCount = dashboardData.stats?.femaleCount ?? 0;

      setChartData({
        labels: ["Male", "Female"],
        datasets: [
          {
            label: "Gender Distribution",
            data: [maleCount, femaleCount],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.12)",
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointRadius: 5,
            fill: true,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#1e293b",
              font: { size: 14 },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#1e293b",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
        scales: {
          x: {
            ticks: { color: "#1e293b" },
            grid: { color: "rgba(0,0,0,0.06)" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#1e293b", stepSize: 1 },
            grid: { color: "rgba(0,0,0,0.06)" },
          },
        },
      });

      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to fetch data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main
        className="ml-56 mt-[72px] p-8 w-full min-h-[calc(100vh-72px)] overflow-y-auto bg-gray-100"
        style={{ paddingBottom: "100px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-700">Volunteer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">
          {volunteerName}
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

        {/* Content */}
        {activeSection === "Dashboard" && (
          <>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
              <>
                {/* Metric Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <MetricCard icon={<FaUsers />} label="Missing Persons" value={stats.missingPersons} color="blue" />
                  <MetricCard icon={<FaUserPlus />} label="Matches Found" value={stats.matchesFound} color="green" />
                  <MetricCard icon={<FaDatabase />} label="Active Camps" value={stats.activeCamps} color="yellow" />
                </div>

                {/* Activities + Quick Actions */}
                {/* Activities + Quick Actions */}
<div className="grid lg:grid-cols-3 gap-6 mb-8">
  <ActivityList activities={activities} />
  <QuickActions setActiveSection={setActiveSection} />
</div>


                {/* Chart */}
                <div className="p-5 rounded-xl shadow-md bg-white">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Gender Breakdown</h2>
                  <div className="h-72">
                    {chartData ? <Line data={chartData} options={chartOptions} /> : <p className="text-center text-gray-500">No chart data available</p>}
                  </div>
                </div>

                {/* Map */}
                <div className="mt-10 p-5 rounded-xl shadow-md bg-white">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Live Map of Persons & Camps</h2>
                  <MapContainer center={[30.3165, 78.0322]} zoom={8} className="h-[500px] w-full rounded-xl" style={{ zIndex: 0 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    {persons
                      .filter((p) => p.latitude && p.longitude)
                      .map((p) => (
                        <Marker key={p._id || `${p.latitude}-${p.longitude}`} position={[p.latitude, p.longitude]}>
                          <Popup>
                            <b>{p.name}</b>
                            <br />Status: {p.status}
                            <br />{p.location}
                          </Popup>
                        </Marker>
                      ))}
                    {camps.map((c) => (
                      <Marker key={c._id || `${c.latitude}-${c.longitude}`} position={[c.latitude, c.longitude]}>
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


        {/* Sections handled inline */}
          {activeSection === "Register Person" && <RegisterPersonForm fetchDashboardData={fetchDashboardData} />}
{activeSection === "Camp Management" && <CampManagement camps={camps} fetchDashboardData={fetchDashboardData} />}
{activeSection === "Case Management" && <CaseManagement persons={persons} fetchDashboardData={fetchDashboardData} />}

        {activeSection === "Search" && <SearchSection persons={persons} />}
        {activeSection === "Reports" && <ReportSection persons={persons} />}
        {activeSection === "Settings" && <SettingsSection user={user} />}
      </main>
    </div>
  );
};

/* -------------------------
   Reusable / Inline Components
   (All light-mode styles)
   ------------------------- */

const MetricCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-400",
    green: "from-green-500 to-green-400",
    yellow: "from-yellow-400 to-yellow-300",
  };
  return (
    <div className={`p-5 rounded-xl shadow-md bg-gradient-to-br ${colorMap[color]} text-white transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div className="text-4xl opacity-80">{icon}</div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
      <p className="mt-2 font-medium">{label}</p>
    </div>
  );
};

const ActivityList = ({ activities }) => (
  <div className="p-5 rounded-xl shadow-md bg-white">
    <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Activity</h2>
    <ul className="space-y-2">
      {activities.length ? (
        activities.map((a, i) => (
          <li key={i} className="border-b pb-2 text-gray-600 last:border-none">
            {a}
          </li>
        ))
      ) : (
        <p className="text-gray-500">No recent activity.</p>
      )}
    </ul>
  </div>
);


const QuickActions = ({ setActiveSection }) => (
  <div className="p-5 rounded-xl shadow-md bg-white">
    <h2 className="text-lg font-semibold mb-3 text-gray-800">Quick Actions</h2>
    <div className="space-y-3">
      <button onClick={() => setActiveSection("Register Person")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Register New Person</button>
      <button onClick={() => setActiveSection("Search")} className="w-full border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">Search Database</button>
      <button onClick={() => setActiveSection("Reports")} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">View Reports</button>
      <button onClick={() => setActiveSection("Camp Management")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition">Manage Camp</button>
    </div>
  </div>
);

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
    <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Case Management</h2>

      {loading && <p className="text-gray-500 text-center">Processing...</p>}

      {!persons?.length ? (
        <p className="text-center text-gray-600">No records found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg text-sm">
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

          <tbody className="bg-gray-50 text-gray-800">
            {persons.map((p) => (
              <tr key={p._id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                <td className="py-2 px-4">
                   <img
  src={getImageUrl(p.image)}
  alt={p.name}
  className="w-14 h-14 rounded-lg object-cover border border-gray-300"
  onError={(e) => {
    console.error('❌ Image failed to load:', p.image);
    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
  }}
/>


                </td>
                <td className="py-2 px-4 font-medium">{p.name}</td>
                <td className="py-2 px-4">{p.age ?? "—"}</td>
                <td className="py-2 px-4">{p.gender ?? "—"}</td>
                <td className={`py-2 px-4 font-semibold ${p.status === "missing" ? "text-red-600" : p.status === "found" ? "text-green-600" : "text-gray-700"}`}>
                  {p.status}
                </td>
                <td className="py-2 px-4">{p.location ?? "—"}</td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

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
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Search Persons</h2>

      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search by name, status, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition" onClick={() => setSearchTerm(searchTerm.trim())}>
          Search
        </button>
      </div>

      {filtered?.length ? (
        <div className="grid md:grid-cols-3 gap-6">
      {filtered.map((p) => (
  <div key={p._id} className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm p-4">
   <img
  src={getImageUrl(p.image)}
  alt={p.name}
  className="w-full h-48 object-cover rounded-lg mb-3"
  onError={(e) => {
    console.error('❌ Image failed to load:', p.image);
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }}
/>


<h3 className="text-lg font-semibold text-blue-700 mb-1">{p.name}</h3>
              <p className="text-gray-700 text-sm"><b>Age:</b> {p.age ?? "—"}</p>
              <p className="text-gray-700 text-sm"><b>Status:</b> <span className={p.status === "missing" ? "text-red-600" : "text-green-600"}>{p.status}</span></p>
              <p className="text-gray-700 text-sm"><b>Location:</b> {p.location ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No persons found matching your search.</p>
      )}
    </div>
  );
};

const ReportSection = ({ persons }) => {
  const total = persons?.length || 0;
  const missing = persons?.filter((p) => p.status === "missing").length || 0;
  const found = persons?.filter((p) => p.status === "found").length || 0;

  const handleExport = () => {
    const csv = persons.map((p) => `${p.name},${p.status},${p.location},${p.age}`).join("\n");
    const blob = new Blob([`Name,Status,Location,Age\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "person_report.csv";
    link.click();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-blue-700">Reports & Statistics</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Persons</h3>
          <p className="text-3xl font-bold text-blue-700">{total}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800">Missing</h3>
          <p className="text-3xl font-bold text-red-600">{missing}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-gray-800">Found</h3>
          <p className="text-3xl font-bold text-green-600">{found}</p>
        </div>
      </div>

      <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition">Export Report (CSV)</button>
    </div>
  );
};

const SettingsSection = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.name || "Volunteer",
    email: user?.email || "volunteer@example.com",
  });
  const [notifications, setNotifications] = useState(true);
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  useEffect(() => {
    const storedProfile = localStorage.getItem("volunteerProfile");
    const storedNotifications = localStorage.getItem("volunteerNotifications");

    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedNotifications) setNotifications(storedNotifications === "true");
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("volunteerProfile", JSON.stringify(profile));
    alert("✅ Profile updated successfully!");
  };

  const handlePasswordUpdate = () => {
    if (!passwords.old || !passwords.new) return alert("⚠️ Please fill both password fields");
    alert("🔒 Password changed successfully!");
    setPasswords({ old: "", new: "" });
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    localStorage.setItem("volunteerNotifications", !notifications);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("👋 You have been logged out!");
    window.location.reload();
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-white space-y-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Settings ⚙️</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Profile</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input type="text" name="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="border rounded-lg px-3 py-2 w-full bg-white" placeholder="Full Name" />
          <input type="email" name="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="border rounded-lg px-3 py-2 w-full bg-white" placeholder="Email Address" />
        </div>
        <button onClick={handleSaveProfile} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">Save Profile</button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={notifications} onChange={handleNotificationToggle} className="w-5 h-5 text-blue-600" />
          <span>Enable Email Alerts for New Reports</span>
        </label>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input type="password" name="old" value={passwords.old} onChange={(e) => setPasswords((p) => ({ ...p, old: e.target.value }))} className="border rounded-lg px-3 py-2 w-full bg-white" placeholder="Old Password" />
          <input type="password" name="new" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} className="border rounded-lg px-3 py-2 w-full bg-white" placeholder="New Password" />
        </div>
        <button onClick={handlePasswordUpdate} className="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition">Update Password</button>
      </div>

      <div className="pt-4 border-t">
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-lg transition">Logout</button>
      </div>
    </div>
  );
};
const CampManagement = ({ camps, fetchDashboardData }) => {
  const [loading, setLoading] = useState(false);
  const [newCamp, setNewCamp] = useState({
    leaderName: "",
    campName: "",
    latitude: "",
    longitude: "",
    capacity: "",
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/camps/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete camp");
      alert("Camp deleted successfully!");
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error deleting camp");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamp = async () => {
    const { campName, latitude, longitude, capacity, leaderName } = newCamp;
    if (!leaderName || !campName || !latitude || !longitude || !capacity) return alert("Please fill all fields");

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/camps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campName,
            leaderName: newCamp.leaderName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          capacity: parseInt(capacity),
        }),
      });
      if (!res.ok) throw new Error("Failed to add camp");
      alert("Camp added successfully!");
     setNewCamp({ campName: "", latitude: "", longitude: "", capacity: "", leaderName: "" });

      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error adding camp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Camp Management</h2>

      {/* Add New Camp */}
      <div className="grid md:grid-cols-4 gap-3">
        <input
  type="text"
  placeholder="Leader Name"
  value={newCamp.leaderName}
  onChange={(e) => setNewCamp({ ...newCamp, leaderName: e.target.value })}
  className="border rounded-lg px-3 py-2 w-full"
/>

        <input
          type="text"
          placeholder="Camp Name"
          value={newCamp.campName}
          onChange={(e) => setNewCamp({ ...newCamp, campName: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={newCamp.latitude}
          onChange={(e) => setNewCamp({ ...newCamp, latitude: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newCamp.longitude}
          onChange={(e) => setNewCamp({ ...newCamp, longitude: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newCamp.capacity}
          onChange={(e) => setNewCamp({ ...newCamp, capacity: e.target.value })}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <button
          onClick={handleAddCamp}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
        >
          Add Camp
        </button>
      </div>

      {/* Existing Camps Table */}
      {loading && <p className="text-gray-500 text-center">Processing...</p>}
      {!camps?.length ? (
        <p className="text-center text-gray-600">No camps found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg text-sm mt-4">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Leader Name</th>
              <th className="py-3 px-4 text-left">Camp Name</th>
              <th className="py-3 px-4 text-left">Latitude</th>
              <th className="py-3 px-4 text-left">Longitude</th>
              <th className="py-3 px-4 text-left">Capacity</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 text-gray-800">
            {camps.map((c) => (
              <tr key={c._id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                <td className="py-2 px-4">{c.leaderName}</td>
               <td className="py-2 px-4 font-medium">{c.campName}</td>
                <td className="py-2 px-4">{c.latitude}</td>
                <td className="py-2 px-4">{c.longitude}</td>
                <td className="py-2 px-4">{c.capacity}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(c._id)}
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


export default VolunteerDashboard;
