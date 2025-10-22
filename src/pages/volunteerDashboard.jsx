import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 import { Line } from "react-chartjs-2";
 import { FaUserPlus, FaDatabase, FaUsers } from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);


const VolunteerDashboard = () => {
  const [stats, setStats] = useState({
    missingPersons: 0,
    matchesFound: 0,
    activeCamps: 0,
  });
  const navigate= useNavigate();
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({});

  // Fetch data dynamically from API (replace with your real endpoint)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/dashboard"); // mock API endpoint
//         const data = await response.json();

//         setStats({
//           missingPersons: data.missingPersons,
//           matchesFound: data.matchesFound,
//           activeCamps: data.activeCamps,
//         });

//         setActivities(data.recentActivity);
//         setChartData({
//           labels: data.chart.labels,
//           datasets: [
//             {
//               label: "Registrations",
//               data: data.chart.registrations,
//               borderColor: "#3b82f6",
//               tension: 0.3,
//             },
//             {
//               label: "Matches",
//               data: data.chart.matches,
//               borderColor: "#22c55e",
//               tension: 0.3,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchData();

//     // auto-refresh every 30 seconds
//     const interval = setInterval(fetchData, 30000);
//     return () => clearInterval(interval);
//   }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        {/* <div className="p-4 text-2xl font-semibold text-blue-600">KhojSetu</div> */}
        <nav className="mt-4 space-y-2">
          {["Dashboard", "Register Person", "Case Management", "Search", "Reports", "Settings"].map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-700 font-medium"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-700">Komal Bhandari</span>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
              Logout
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <MetricCard icon={<FaUsers />} label="Missing Persons" value={stats.missingPersons} time="5 mins ago" />
          <MetricCard icon={<FaUserPlus />} label="Matches Found" value={stats.matchesFound} time="1 hr ago" />
          <MetricCard icon={<FaDatabase />} label="Active Camps" value={stats.activeCamps} time="5 mins ago" />
        </div>

        {/* Activity + Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <ul className="text-gray-600 space-y-2">
              {/* {activities.map((activity, index) => (
                <li key={index} className="border-b pb-1">{activity}</li>
              ))} */}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <button
                onClick={() => navigate("/newPerson_Registration")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-3"
                >
                Register New Person
            </button>

            <button className="w-full border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
              Search Database
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Monthly Registrations vs. Matches</h2>
          <div className="h-64">
            {/* <Line data={chartData} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable metric card component
const MetricCard = ({ icon, label, value, time }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="text-gray-500">{icon}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
    <div>
      <p className="text-gray-700 font-medium">{label}</p>
      <p className="text-gray-400 text-sm">{time}</p>
    </div>
  </div>
);

export default VolunteerDashboard;
