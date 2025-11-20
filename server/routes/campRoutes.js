import express from "express";
import Camp from "../models/campModel.js";

const router = express.Router();

// ➕ Add new camp
router.post("/register", async (req, res) => {
  try {
    const camp = new Camp(req.body);
    await camp.save();
    res.status(201).json({ message: "Camp added successfully", camp });
  } catch (error) {
    res.status(500).json({ message: "Failed to add camp", error: error.message });
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

export default router;
