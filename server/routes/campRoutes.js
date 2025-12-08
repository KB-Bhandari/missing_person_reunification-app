import express from "express";
import Camp from "../models/campModel.js";

const router = express.Router();

// ➕ Add new camp
router.post("/", async (req, res) => {
  try {
    const { leaderName, campName, latitude, longitude, capacity } = req.body;

    console.log("Received data:", req.body); // <-- See what frontend sends

    const newCamp = new Camp({
      leaderName,
      campName,
      latitude,
      longitude,
      capacity,
    });

    await newCamp.save();

    res.status(201).json({ message: "Camp added successfully", newCamp });
  } catch (err) {
    console.error("Error adding camp:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});


// 📋 Get all camps
router.get("/", async (req, res) => {
  try {
    const camps = await Camp.find();
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch camps", error: error.message });
  }
});
// 🗑️ Delete a camp by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCamp = await Camp.findByIdAndDelete(id);

    if (!deletedCamp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json({ message: "Camp deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete camp", error: error.message });
  }
});


export default router;
