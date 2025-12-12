import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, TrendingUp, Calendar, MapPin, Heart, Search, X, Plus, Trash2, Phone, Mail, CreditCard } from "lucide-react";

const AdminApprove = ({ token }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [volunteers, setVolunteers] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assignments, setAssignments] = useState([]);
const [selectedCamp, setSelectedCamp] = useState(null);
const [selectedAssignVolunteer, setSelectedAssignVolunteer] = useState(null);

  const [stats, setStats] = useState({
    totalVolunteers: 0,
    pendingApprovals: 0,
    activeCamps: 0,
    familiesHelped: 0
  });
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000/api";

  // Fetch dashboard data on mount
  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please login.");
      return;
    }
    fetchDashboardData();
  }, [token]);

  // Fetch data when tab changes
  useEffect(() => {
    if (!token) return;
    
    if (activeTab === "approve") {
      fetchPendingVolunteers();
    } else if (activeTab === "camps") {
      fetchCamps();
    } else if (activeTab === "volunteers") {
      fetchAllVolunteers();
    }
  }, [activeTab, token]);
  useEffect(() => {
  if (!token) return;

  if (activeTab === "assign") {
    fetchAllVolunteers();
    fetchCamps();
  }
}, [activeTab]);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsRes = await fetch(`${API_BASE}/admin/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        console.log("✅ Stats loaded:", statsData);
      } else {
        console.error("Failed to fetch stats:", statsRes.status);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const fetchPendingVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE}/admin/pending-volunteers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ Pending volunteers loaded:", data.length);
      setVolunteers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending volunteers:", err);
      setError(`Failed to load pending volunteers: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchAllVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/admin/volunteers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ All volunteers loaded:", data.length);
      setAllVolunteers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching all volunteers:", err);
      setError(`Failed to load volunteers: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchCamps = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_BASE}/camps`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    setCamps(data);
  } catch (error) {
    console.error("Camps error:", error);
    setCamps([]);
  } finally {
    setLoading(false);
  }
};

  const approveVolunteer = async (id) => {
    if (!window.confirm("Are you sure you want to approve this volunteer?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to approve volunteer");

      // Remove from pending list
      setVolunteers(volunteers.filter(v => v._id !== id));
      setStats(prev => ({
        ...prev,
        totalVolunteers: prev.totalVolunteers + 1,
        pendingApprovals: prev.pendingApprovals - 1
      }));

      alert("✅ Volunteer approved successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error approving volunteer:", err);
      alert("❌ Failed to approve volunteer");
    }
  };

  const rejectVolunteer = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    
    try {
      const res = await fetch(`${API_BASE}/admin/reject/${id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: reason || "Application not approved" })
      });

      if (!res.ok) throw new Error("Failed to reject volunteer");

      setVolunteers(volunteers.filter(v => v._id !== id));
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));

      alert("Volunteer application rejected");
      fetchDashboardData();
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      alert("Failed to reject volunteer");
    }
  };

  const deleteVolunteer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete volunteer");

      setAllVolunteers(allVolunteers.filter(v => v._id !== id));
      alert("Volunteer deleted successfully");
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting volunteer:", err);
      alert("Failed to delete volunteer");
    }
  };
// -------------------- Camp assignment --------------------
const assignVolunteerToCamp = async (volunteerId, campId) => {
  if (!volunteerId || !campId) return;
  try {
    const res = await fetch(`${API_BASE}/admin/assign-volunteer`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId, campId })
    });
    if (!res.ok) throw new Error("Failed to assign volunteer");
    alert("✅ Volunteer assigned!");
    fetchAllVolunteers();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to assign volunteer");
  }
};

const removeVolunteerFromCamp = async (volunteerId, campId) => {
  if (!volunteerId || !campId) return;
  try {
    const res = await fetch(`${API_BASE}/admin/remove-volunteer`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId, campId })
    });
    if (!res.ok) throw new Error("Failed to remove volunteer");
    alert("✅ Volunteer removed!");
    fetchAllVolunteers();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to remove volunteer");
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getLocation = (volunteer) => {
    if (volunteer.city && volunteer.state) {
      return `${volunteer.city}, ${volunteer.state}`;
    }
    return volunteer.address || "N/A";
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredAllVolunteers = allVolunteers.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: color + "20" }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <Heart className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Relief Admin</h2>
              <p className="text-blue-200 text-xs">Management Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
              activeTab === "dashboard" ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("approve")}
            className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
              activeTab === "approve" ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Approve Volunteers</span>
            {stats.pendingApprovals > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("volunteers")}
            className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
              activeTab === "volunteers" ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">All Volunteers</span>
          </button>

          <button
            onClick={() => setActiveTab("camps")}
            className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
              activeTab === "camps" ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Manage Camps</span>
          </button>

          <button
  onClick={() => setActiveTab("assign")}
  className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
    activeTab === "assign" ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
  }`}
>
  <Plus className="w-5 h-5" />
  <span className="font-medium">Assign Volunteers</span>
</button>

        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "approve" && "Volunteer Approvals"}
            {activeTab === "camps" && "Camp Management"}
            {activeTab === "volunteers" && "All Volunteers"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === "dashboard" && "Monitor your relief operations at a glance"}
            {activeTab === "approve" && "Review and approve volunteer applications"}
            {activeTab === "camps" && "Manage relief camps and operations"}
            {activeTab === "volunteers" && "View all approved volunteers"}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">⚠️ Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Active Volunteers"
                  value={stats.totalVolunteers}
                  color="#3B82F6"
                />
                <StatCard
                  icon={Clock}
                  title="Pending Approvals"
                  value={stats.pendingApprovals}
                  color="#F59E0B"
                />
               <StatCard
  icon={Users}
  title="Total Families"
  value={stats.totalFamilies}
  color="#F97316"
/>

<StatCard
  icon={Calendar}
  title="Total Camps"
  value={stats.totalCamps}
  color="#8B5CF6"
/>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("approve")}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-800">Review Volunteers</p>
                    <p className="text-xs text-gray-500">{stats.pendingApprovals} pending</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("volunteers")}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                  >
                    <Users className="w-6 h-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-800">All Volunteers</p>
                    <p className="text-xs text-gray-500">{stats.totalVolunteers} active</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("camps")}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                  >
                    <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-800">Manage Camps</p>
                    <p className="text-xs text-gray-500">{stats.activeCamps} camps</p>
                  </button>
                  <button
                    onClick={fetchDashboardData}
                    className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
                  >
                    <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="font-medium text-gray-800">Refresh Data</p>
                    <p className="text-xs text-gray-500">Update stats</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "approve" && (
            
            <div>
              <div className="bg-white rounded-lg shadow-md mb-6 p-4 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={fetchPendingVolunteers}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              )}

              {!loading && filteredVolunteers.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No pending applications</p>
                  <p className="text-gray-400 text-sm mt-2">All volunteer applications have been processed</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVolunteers.map((v) => (
                  <div key={v._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                          {v.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 text-white">
                          <h3 className="font-bold text-xl">{v.name || "Unknown"}</h3>
                          <p className="text-blue-100 text-sm flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {v.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {v.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {v.phone}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {getLocation(v)}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Applied: {formatDate(v.createdAt)}
                      </div>

                      {v.skills && v.skills.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {v.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                            {v.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{v.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex gap-2">
                      <button
                        onClick={() => setSelectedVolunteer(v)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        View Full
                      </button>
                      <button
                        onClick={() => approveVolunteer(v._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectVolunteer(v._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "assign" && (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800">Assign Volunteers to Camps</h2>

    {/* Error */}
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-medium text-gray-500">Select Camp</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedCamp?._id || ""}
          onChange={(e) => setSelectedCamp(camps.find(c => c._id === e.target.value))}
        >
          <option value="">-- Choose a Camp --</option>
          {camps.map(c => (
            <option key={c._id} value={c._id}>
              {c.name} ({formatDate(c.startDate)} - {formatDate(c.endDate)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">Select Volunteer</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedAssignVolunteer?._id || ""}
          onChange={(e) => setSelectedAssignVolunteer(allVolunteers.find(v => v._id === e.target.value))}
        >
          <option value="">-- Choose a Volunteer --</option>
          {allVolunteers.map(v => (
            <option key={v._id} value={v._id}>
              {v.name} ({v.email})
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex gap-4 mt-4">
      <button
        onClick={async () => {
          if (!selectedAssignVolunteer || !selectedCamp) return;
          setLoading(true);
          setError(null);
          try {
            await assignVolunteerToCamp(selectedAssignVolunteer._id, selectedCamp._id);
            alert("✅ Volunteer assigned!");
            setSelectedAssignVolunteer(null);
            setSelectedCamp(null);
            fetchAllVolunteers();
          } catch (err) {
            setError("Failed to assign volunteer");
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
        disabled={!selectedAssignVolunteer || !selectedCamp || loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300"
      >
        Assign Volunteer
      </button>

      <button
        onClick={async () => {
          if (!selectedAssignVolunteer || !selectedCamp) return;
          setLoading(true);
          setError(null);
          try {
            await removeVolunteerFromCamp(selectedAssignVolunteer._id, selectedCamp._id);
            alert("✅ Volunteer removed!");
            setSelectedAssignVolunteer(null);
            setSelectedCamp(null);
            fetchAllVolunteers();
          } catch (err) {
            setError("Failed to remove volunteer");
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
        disabled={!selectedAssignVolunteer || !selectedCamp || loading}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300"
      >
        Remove Volunteer
      </button>
    </div>

    {loading && (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 mt-2">Processing...</p>
      </div>
    )}
  </div>
)}



          {activeTab === "volunteers" && (
            <div>
              <div className="bg-white rounded-lg shadow-md mb-6 p-4 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={fetchAllVolunteers}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              )}

              {!loading && filteredAllVolunteers.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No volunteers found</h3>
                  <p className="text-gray-600">Try adjusting your search</p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAllVolunteers.map((v) => (
                      <tr key={v._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {v.name?.charAt(0) || "?"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{v.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{getLocation(v)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{v.email || "N/A"}</div>
                          <div className="text-sm text-gray-500">{v.phone || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            v.status === 'active' || v.status === 'approved' ? 'bg-green-100 text-green-800' :
                            v.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {v.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteVolunteer(v._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


{activeTab === "camps" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">Camps</h2>
      <button
        onClick={fetchCamps}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>

    {loading && (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )}

    {!loading && camps.length === 0 && (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Camps Found</h3>
        <p className="text-gray-600 text-sm">Create camps to start managing them</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {camps.map((camp) => (
        <div key={camp._id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-gray-800">{camp.name}</h3>
          <p className="text-gray-500">{camp.location || "Location not specified"}</p>
          <p className="text-gray-500">Start: {formatDate(camp.startDate)}</p>
          <p className="text-gray-500">End: {formatDate(camp.endDate)}</p>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
      </div>

      {/* VOLUNTEER DETAILS MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">
                    {selectedVolunteer.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedVolunteer.name}</h2>
                    <p className="text-blue-100 mt-1">{selectedVolunteer.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedVolunteer.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                      selectedVolunteer.status === 'active' ? 'bg-green-400 text-green-900' :
                      'bg-red-400 text-red-900'
                    }`}>
                      {selectedVolunteer.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h3>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-800 font-medium">{selectedVolunteer.name || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-gray-800">{selectedVolunteer.email || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <p className="text-gray-800">{selectedVolunteer.phone || "N/A"}</p>
                  </div>

                  {selectedVolunteer.dateOfBirth && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-800">{formatDate(selectedVolunteer.dateOfBirth)}</p>
                    </div>
                  )}

                  {selectedVolunteer.gender && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Gender</label>
                      <p className="text-gray-800 capitalize">{selectedVolunteer.gender}</p>
                    </div>
                  )}
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Address</h3>
                  
                  {selectedVolunteer.address && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Full Address</label>
                      <p className="text-gray-800">{selectedVolunteer.address}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">City</label>
                      <p className="text-gray-800">{selectedVolunteer.city || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">State</label>
                      <p className="text-gray-800">{selectedVolunteer.state || "N/A"}</p>
                    </div>
                  </div>

                  {selectedVolunteer.pincode && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">PIN Code</label>
                      <p className="text-gray-800">{selectedVolunteer.pincode}</p>
                    </div>
                  )}
                </div>

                {/* ID Verification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Identity Verification</h3>
                  
                  {selectedVolunteer.idType && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">ID Type</label>
                      <p className="text-gray-800 uppercase font-medium">{selectedVolunteer.idType}</p>
                    </div>
                  )}

                  {selectedVolunteer.idNumber && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">ID Number</label>
                      <p className="text-gray-800 font-mono">{selectedVolunteer.idNumber}</p>
                    </div>
                  )}
                </div>

                {/* Volunteer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Volunteer Details</h3>
                  
                  {selectedVolunteer.occupation && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Occupation</label>
                      <p className="text-gray-800">{selectedVolunteer.occupation}</p>
                    </div>
                  )}

                  {selectedVolunteer.availability && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Availability</label>
                      <p className="text-gray-800 capitalize">{selectedVolunteer.availability}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-gray-500">Application Date</label>
                    <p className="text-gray-800">{formatDate(selectedVolunteer.createdAt)}</p>
                  </div>
                </div>

                {/* Skills */}
                {selectedVolunteer.skills && selectedVolunteer.skills.length > 0 && (
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedVolunteer.experience && (
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Previous Experience</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedVolunteer.experience}</p>
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Emergency Contact</h3>
                  
                  {selectedVolunteer.emergencyContact && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Contact Name</label>
                      <p className="text-gray-800 font-medium">{selectedVolunteer.emergencyContact}</p>
                    </div>
                  )}

                  {selectedVolunteer.emergencyPhone && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-800">{selectedVolunteer.emergencyPhone}</p>
                    </div>
                  )}
                </div>

                {/* Motivation */}
                {selectedVolunteer.reasonToVolunteer && (
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Motivation to Volunteer</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 italic leading-relaxed">
                        "{selectedVolunteer.reasonToVolunteer}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t rounded-b-lg flex gap-3">
              {selectedVolunteer.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      approveVolunteer(selectedVolunteer._id);
                      setSelectedVolunteer(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Volunteer
                  </button>
                  <button
                    onClick={() => {
                      rejectVolunteer(selectedVolunteer._id);
                      setSelectedVolunteer(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminApprove;