import Volunteer from "../models/Volunteer.js";
import bcrypt from "bcryptjs";

// Add volunteer
export const addVolunteer = async (req, res) => {
  try {
    const { name, email, password, phone, role, assignedCamp } = req.body;

    const exists = await Volunteer.findOne({ email });
    if (exists) return res.status(400).json({ message: "Volunteer already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const volunteer = await Volunteer.create({
      name,
      email,
      password: hashed,
      phone,
      role,
      assignedCamp,
      status: "active"
    });

    res.status(201).json({ message: "Volunteer added", volunteer });
  } catch (error) {
    res.status(500).json({ message: "Error adding volunteer" });
  }
};

// Get volunteers with pending status
export const getPendingVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ status: "pending" });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve volunteer
export const approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    await Volunteer.findByIdAndUpdate(id, { status: "active" });
    res.json({ message: "Volunteer approved!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
