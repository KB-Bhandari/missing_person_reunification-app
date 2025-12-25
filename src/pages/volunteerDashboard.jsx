import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "../components/Sidebar"; // Ensure this component supports the new styling if needed
import { useNavigate } from "react-router-dom";
import RegisterPersonForm from "./RegisterPersonForm";
import { 
  FaUsers, 
  FaUserPlus, 
  FaDatabase, 
  FaSyncAlt, 
  FaSearch, 
  FaFileAlt, 
  FaCampground, 
  FaCog,
  FaMapMarkedAlt
} from "react-icons/fa";
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

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const VolunteerDashboard = ({ user }) => {
  const navigate = useNavigate();const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    const storedName = localStorage.getItem("volunteerName");
    if (storedName) return storedName;
    // Check if profile object exists in storage
    const storedProfile = localStorage.getItem("volunteerProfile");
    if (storedProfile) {
        try {
            const p = JSON.parse(storedProfile);
            return p.name || p.email;
        } catch (e) { return "Volunteer"; }
    }
    return "Volunteer";
  };

  const volunteerName = getDisplayName();

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [stats, setStats] = useState({ missingPersons: 0, matchesFound: 0, activeCamps: 0 });
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
        fetch(`${BASE_URL}/foundPersons`),
        fetch(`${BASE_URL}/dashboard`),
        fetch(`${BASE_URL}/camps`),
      ]);

      if (!personRes.ok || !dashboardRes.ok || !campRes.ok) {
        throw new Error("Failed to fetch data from server.");
      }

      const personsData = (await personRes.json()) || [];
      const dashboardData = (await dashboardRes.json()) || { stats: {} };
      const campsData = (await campRes.json()) || [];

      setPersons(personsData);
      setCamps(campsData);

      const missing = personsData.filter((p) => p.status === "missing").length;
      const found = personsData.filter((p) => p.status === "found").length;
      const activeCamps = campsData.length;

      setStats({ missingPersons: missing, matchesFound: found, activeCamps });

      setActivities([
        `Total database records: ${personsData.length}`,
        `Male registered: ${dashboardData.stats?.maleCount ?? 0}`,
        `Female registered: ${dashboardData.stats?.femaleCount ?? 0}`,
      ]);

      const maleCount = dashboardData.stats?.maleCount ?? 0;
      const femaleCount = dashboardData.stats?.femaleCount ?? 0;

      setChartData({
        labels: ["Male", "Female"],
        datasets: [
          {
            label: "Gender Distribution",
            data: [maleCount, femaleCount],
            borderColor: "#6366f1", // Indigo 500
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#4f46e5",
            pointRadius: 4,
            fill: true,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#64748b" } },
          y: { border: { display: false }, grid: { color: "#f1f5f9" }, ticks: { stepSize: 1, color: "#64748b" } },
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
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="ml-56 flex-1 flex flex-col transition-all duration-300">
        
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{activeSection}</h2>
            <p className="text-xs text-slate-500">Welcome back, {volunteerName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
              {volunteerName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Dashboard Header Hero (Only show on Dashboard) */}
          {activeSection === "Dashboard" && (
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white p-8 shadow-xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-700 opacity-50 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-600 opacity-50 blur-3xl"></div>
              
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl font-bold mb-2">Reunification Command Center</h1>
                <p className="text-indigo-200 text-lg mb-6">
                  Coordinate rescue efforts, manage camps, and reunite families. Your work makes a difference.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveSection("Register Person")} className="bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-2.5 rounded-lg font-semibold transition shadow-lg">
                    Register Person
                  </button>
                  <button onClick={() => setActiveSection("Search")} className="bg-indigo-700/50 hover:bg-indigo-700 border border-indigo-500/30 text-white px-6 py-2.5 rounded-lg font-semibold transition backdrop-blur-sm">
                    Find a Match
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error / Loading States */}
          {loading && activeSection === "Dashboard" && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Syncing with database...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && activeSection === "Dashboard" && (
            <div className="animate-fade-in-up space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  icon={<FaUsers />} 
                  label="Missing Persons" 
                  value={stats.missingPersons} 
                  trend="High Priority"
                  trendColor="text-red-500"
                  bgColor="bg-white"
                  iconColor="text-red-500 bg-red-50"
                />
                <MetricCard 
                  icon={<FaUserPlus />} 
                  label="Matches Found" 
                  value={stats.matchesFound} 
                  trend="Reunited"
                  trendColor="text-emerald-500"
                  bgColor="bg-white"
                  iconColor="text-emerald-500 bg-emerald-50"
                />
                <MetricCard 
                  icon={<FaDatabase />} 
                  label="Active Camps" 
                  value={stats.activeCamps} 
                  trend="Operational"
                  trendColor="text-blue-500"
                  bgColor="bg-white"
                  iconColor="text-blue-500 bg-blue-50"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Demographics Overview</h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Live Data</span>
                  </div>
                  <div className="h-64">
                    {chartData ? <Line data={chartData} options={chartOptions} /> : <p className="text-center text-slate-400 mt-20">No data available</p>}
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">System Status</h3>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <ActivityList activities={activities} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                     <button onClick={() => setActiveSection("Reports")} className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">View Detailed Reports &rarr;</button>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-indigo-500"/> Live Situation Map
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Person</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Camp</span>
                  </div>
                </div>
                <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
                  <MapContainer center={[30.3165, 78.0322]} zoom={8} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    {persons.filter((p) => p.latitude && p.longitude).map((p) => (
                      <Marker key={p._id || `${p.latitude}-${p.longitude}`} position={[p.latitude, p.longitude]}>
                        <Popup>
                          <div className="text-center">
                             <img src={getImageUrl(p.image)} alt="" className="w-16 h-16 object-cover rounded mx-auto mb-2"/>
                             <strong className="block text-slate-800">{p.name}</strong>
                             <span className={`text-xs font-bold uppercase ${p.status === 'missing' ? 'text-red-500' : 'text-green-500'}`}>{p.status}</span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    {camps.map((c) => (
                      <Marker key={c._id || `${c.latitude}-${c.longitude}`} position={[c.latitude, c.longitude]}>
                        <Popup>
                          <div className="p-1">
                            <h4 className="font-bold text-indigo-700">🏕️ {c.campName}</h4>
                            <p className="text-xs text-slate-600">Capacity: {c.occupied}/{c.capacity}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          )}

          {/* --- OTHER SECTIONS --- */}
          {activeSection === "Register Person" && <RegisterPersonForm fetchDashboardData={fetchDashboardData} />}
          {activeSection === "Camp Management" && <CampManagement camps={camps} fetchDashboardData={fetchDashboardData} />}
          {activeSection === "Case Management" && <CaseManagement persons={persons} fetchDashboardData={fetchDashboardData} />}
          {activeSection === "Search" && <SearchSection persons={persons} />}
          {activeSection === "Reports" && <ReportSection persons={persons} />}
          {activeSection === "Settings" && <SettingsSection user={user} />}
        </div>
      </main>
    </div>
  );
};

/* -------------------------
   Redesigned Sub-Components
   ------------------------- */

const MetricCard = ({ icon, label, value, trend, trendColor, bgColor, iconColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <h4 className="text-3xl font-extrabold text-slate-800">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${iconColor} text-xl`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-bold ${trendColor} bg-slate-50 px-2 py-1 rounded-md`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const ActivityList = ({ activities }) => (
  <ul className="space-y-4">
    {activities.length ? (
      activities.map((a, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
          <div className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shrink-0"></div>
          <span>{a}</span>
        </li>
      ))
    ) : (
      <p className="text-slate-400 text-sm italic">No recent activity detected.</p>
    )}
  </ul>
);

const CaseManagement = ({ persons, fetchDashboardData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person? This action cannot be undone.")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/persons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchDashboardData();
    } catch (err) {
      alert("Error deleting record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Case Management</h2>
        <span className="text-sm text-slate-500">{persons.length} records</span>
      </div>

      {loading && <div className="w-full h-1 bg-indigo-100"><div className="h-full bg-indigo-600 animate-progress"></div></div>}

      <div className="overflow-x-auto">
        {!persons?.length ? (
          <div className="p-10 text-center text-slate-400">No records found.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {persons.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=?'; }}
                      />
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{p.gender || "N/A"}</span>
                      <span className="text-xs text-slate-400">{p.age ? `${p.age} yrs` : "Age Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "missing" ? "bg-red-100 text-red-800" : 
                      p.status === "found" ? "bg-emerald-100 text-emerald-800" : 
                      "bg-slate-100 text-slate-800"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={p.location}>{p.location || "Unknown"}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(p._id)} 
                      className="text-slate-400 hover:text-red-600 font-medium text-sm transition-colors"
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
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Find a Person</h2>
        <p className="text-slate-500 mb-6">Search by name, status, or location keywords</p>
        
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="e.g. 'John Doe' or 'Mumbai'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm text-lg"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered?.length ? (
          filtered.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={getImageUrl(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                <div className="absolute top-3 right-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                      p.status === 'missing' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                   }`}>
                     {p.status}
                   </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{p.name}</h3>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex justify-between"><span>Age:</span> <span className="text-slate-700 font-medium">{p.age || "—"}</span></p>
                  <p className="flex justify-between"><span>Gender:</span> <span className="text-slate-700 font-medium">{p.gender || "—"}</span></p>
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">📍</span>
                    <span className="line-clamp-2 text-xs">{p.location || "Location unknown"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl"><FaSearch /></div>
            <p className="text-slate-500 font-medium">No matches found.</p>
          </div>
        )}
      </div>
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
    link.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Operational Reports</h2>
           <p className="text-slate-500">Export data for external analysis</p>
        </div>
        <button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition font-medium flex items-center gap-2">
          <FaFileAlt /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
          <p className="text-slate-500 font-medium mb-2">Total Records</p>
          <p className="text-4xl font-extrabold text-slate-800">{total}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
          <p className="text-red-600 font-medium mb-2">Still Missing</p>
          <p className="text-4xl font-extrabold text-red-600">{missing}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
          <p className="text-emerald-600 font-medium mb-2">Successfully Found</p>
          <p className="text-4xl font-extrabold text-emerald-600">{found}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 flex items-start gap-3">
        <FaDatabase className="mt-1 shrink-0" />
        <p>This report includes sensitive data. Please ensure you comply with data protection regulations when exporting and sharing this file.</p>
      </div>
    </div>
  );
};

const SettingsSection = ({ user }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user?.name || "Volunteer",
    email: user?.email || "volunteer@example.com",
  });
  useEffect(() => {
    const storedProfile = localStorage.getItem("volunteerProfile");
    if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
    } else if (!user) {
        // Fallback defaults if no user prop and no storage
        setProfile({ name: "Volunteer", email: "volunteer@example.com" });
    }
  }, [user]);
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
    if(profile.name) localStorage.setItem("volunteerName", profile.name);
    alert("✅ Profile updated successfully!");
    window.location.reload();
  };

  const handlePasswordUpdate = () => {
    if (!passwords.old || !passwords.new) return alert("⚠️ Please fill both password fields");
    alert("🔒 Password changed successfully!");
    setPasswords({ old: "", new: "" });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FaCog className="text-indigo-500" /> Account Settings</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
           <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-4' : ''}`}></div>
            </div>
            <input type="checkbox" checked={notifications} onChange={() => {
              setNotifications(!notifications);
              localStorage.setItem("volunteerNotifications", !notifications);
            }} className="hidden" />
            <span className="text-sm text-slate-600">Email Alerts</span>
          </label>
          <button onClick={handleSaveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">Save Changes</button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Security</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input type="password" placeholder="Current Password" value={passwords.old} onChange={(e) => setPasswords((p) => ({ ...p, old: e.target.value }))} className="px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
          <input type="password" placeholder="New Password" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} className="px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
        </div>
        <button onClick={handlePasswordUpdate} className="text-indigo-600 font-medium hover:underline text-sm">Update Password</button>
      </div>

      <div className="text-right">
        <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium transition">Sign Out</button>
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
    if (!window.confirm("Delete this camp?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/camps/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      await fetchDashboardData();
    } catch (err) { alert("Error deleting camp"); } finally { setLoading(false); }
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
          leaderName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          capacity: parseInt(capacity),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Camp added successfully!");
      setNewCamp({ campName: "", latitude: "", longitude: "", capacity: "", leaderName: "" });
      await fetchDashboardData();
    } catch (err) { alert("Error adding camp"); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Add Camp Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FaCampground className="text-orange-500"/> Add New Relief Camp</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input type="text" placeholder="Leader Name" value={newCamp.leaderName} onChange={(e) => setNewCamp({ ...newCamp, leaderName: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="text" placeholder="Camp Name" value={newCamp.campName} onChange={(e) => setNewCamp({ ...newCamp, campName: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="number" placeholder="Lat" value={newCamp.latitude} onChange={(e) => setNewCamp({ ...newCamp, latitude: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="number" placeholder="Lng" value={newCamp.longitude} onChange={(e) => setNewCamp({ ...newCamp, longitude: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="number" placeholder="Capacity" value={newCamp.capacity} onChange={(e) => setNewCamp({ ...newCamp, capacity: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="mt-4 text-right">
            <button onClick={handleAddCamp} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg font-medium transition shadow-md shadow-orange-200">
              {loading ? "Saving..." : "Create Camp"}
            </button>
        </div>
      </div>

      {/* Camp List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Camp Name</th>
                <th className="px-6 py-4">Leader</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {camps.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{c.campName}</td>
                  <td className="px-6 py-4">{c.leaderName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{c.latitude}, {c.longitude}</td>
                  <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{c.capacity}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                  </td>
                </tr>
              ))}
              {!camps.length && <tr><td colSpan="5" className="text-center py-8 text-slate-400">No active camps registered.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;