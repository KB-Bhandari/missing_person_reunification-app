import React from "react";
import {
  FaUserPlus,
  FaDatabase,
  FaUsers,
  FaChartLine,
  FaSearch,
  FaCog,
  FaFileAlt,
  FaTasks,
} from "react-icons/fa";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sidebarItems = [
    { name: "Dashboard", icon: <FaChartLine /> },
    { name: "Register Person", icon: <FaUserPlus /> },
    { name: "Case Management", icon: <FaTasks /> },
    { name: "Search", icon: <FaSearch /> },
    { name: "Reports", icon: <FaFileAlt /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <aside
      className="fixed top-[72px] left-0 w-56 h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg overflow-y-auto z-30"
      style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
    >
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveSection(item.name)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
              activeSection === item.name
                ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
