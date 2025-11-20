import React, { useEffect, useState } from "react";

const AdminVolunteerApproval = () => {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch pending volunteers
  const fetchPendingVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/volunteers/pending");
      const data = await res.json();

      setPendingVolunteers(data);
    } catch (error) {
      console.log(error);
      setMessage("Error loading volunteers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingVolunteers();
  }, []);

  // Approve volunteer
  const approveVolunteer = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/volunteers/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      setMessage(data.message);

      // Refresh the list
      fetchPendingVolunteers();
    } catch (error) {
      console.log(error);
      setMessage("Approval failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Pending Volunteer Approvals</h1>

      {message && (
        <p className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-600">Loading volunteers...</p>
      ) : pendingVolunteers.length === 0 ? (
        <p className="text-gray-600">No pending volunteers.</p>
      ) : (
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingVolunteers.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.email}</td>
                <td className="p-3 capitalize">{v.status}</td>

                <td className="p-3 text-center">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => approveVolunteer(v._id)}
                  >
                    Approve
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

export default AdminVolunteerApproval;
