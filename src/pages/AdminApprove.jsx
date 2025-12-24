import React, { useEffect, useState } from "react";

const AdminApprove = () => {
  const [volunteers, setVolunteers] = useState([]);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/api/admin/pending-volunteers");
    const data = await res.json();
    setVolunteers(data);
  };

  const approve = async (id) => {
    await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
      method: "PUT",
    });
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Volunteers</h2>

      {volunteers.map((v) => (
        <div key={v._id} className="border p-4 mb-2 rounded">
          <p>Name: {v.name}</p>
          <p>Email: {v.email}</p>

          <button
            onClick={() => approve(v._id)}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminApprove;
