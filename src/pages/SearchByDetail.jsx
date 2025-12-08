import React, { useState } from "react";
import axios from "axios";

const SearchByDetail = () => {
  const [formData, setFormData] = useState({
    name: "",
    approxAge: "",
    lastSeenLocation: "",
    photo: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      alert("⚠️ Photo is required!");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("approxAge", formData.approxAge);
    fd.append("lastSeenLocation", formData.lastSeenLocation);
    fd.append("photo", formData.photo);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/familySearch/details"

      );

      alert("✅ Successfully saved!");
      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("❌ Error submitting data");
    }
  };

  return (
    <div className="form-page">
      <h2>Search Missing Person</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          type="number"
          name="approxAge"
          placeholder="Approx Age"
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastSeenLocation"
          placeholder="Last Seen Location"
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleFile} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchByDetail;
