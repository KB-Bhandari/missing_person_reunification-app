import React, { useState } from "react";

export default function PotentialMatches() {
  const [gender, setGender] = useState("All");
  const [search, setSearch] = useState("");

  // 🔹 ONLY FOR UI DEMO (frontend page)
  const profiles = [
    {
      id: 1,
      name: "Lisa Brown",
      age: 29,
      city: "San Francisco",
      gender: "Female",
      status: "Matched",
      color: "#3b82f6",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      age: 34,
      city: "New York",
      gender: "Male",
      status: "Under Review",
      color: "#a78bfa",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Sarah Smith",
      age: 26,
      city: "Los Angeles",
      gender: "Female",
      status: "New",
      color: "#22c55e",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const filteredProfiles = profiles.filter((p) => {
    const genderOk = gender === "All" || p.gender === gender;
    const nameOk = p.name.toLowerCase().includes(search.toLowerCase());
    return genderOk && nameOk;
  });

  return (
    <div style={styles.page}>
      <h2>Potential Matches</h2>

      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filteredProfiles.map((u) => (
          <div key={u.id} style={styles.card}>
            <img src={u.img} alt={u.name} style={styles.avatar} />
            <h4>{u.name}</h4>
            <p>{u.age} · {u.city}</p>
            <span style={{ ...styles.badge, background: u.color }}>
              {u.status}
            </span>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <p>No matching profiles</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 40,
    background: "#f5f9ff",
    minHeight: "100vh",
    fontFamily: "Arial",
  },
  controls: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
  },
  select: {
    padding: 10,
    borderRadius: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
  },
  badge: {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 12px",
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
  },
};
