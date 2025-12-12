import Admin from "../models/admin.js";
import Volunteer from "../models/volunteer.js";
import Camp from "../models/campModel.js";
import Family from "../models/family.js";   // <-- Make sure this model exists
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================================
   ADMIN AUTH
============================================================ */

export const registerAdmin = async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid secret key" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({ email, password });
    res.status(201).json({ message: "Admin registered successfully!" });

  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Server error during admin registration" });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, name: admin.email });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};


/* ============================================================
   VOLUNTEER MANAGEMENT
============================================================ */

export const getPendingVolunteers = async (req, res) => {
  try {
    const pending = await Volunteer.find({ status: "pending" }).select("-password");
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate("assignedCamp");
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Error approving volunteer" });
  }
};

export const rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Error rejecting volunteer" });
  }
};

export const deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting volunteer" });
  }
};

export const addVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Error adding volunteer" });
  }
};


/* ============================================================
   CAMP MANAGEMENT
============================================================ */

export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().populate("volunteersAssigned", "name email");
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching camps" });
  }
};

export const getCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate("volunteersAssigned", "name email");
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: "Error fetching camp" });
  }
};

export const createCamp = async (req, res) => {
  try {
    const camp = await Camp.create(req.body);
    res.status(201).json(camp);
  } catch (err) {
    res.status(500).json({ message: "Error creating camp" });
  }
};

export const updateCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: "Error updating camp" });
  }
};

export const deleteCamp = async (req, res) => {
  try {
    await Camp.findByIdAndDelete(req.params.id);
    res.json({ message: "Camp deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting camp" });
  }
};


/* ============================================================
   FAMILY MANAGEMENT
============================================================ */

export const getAllFamilies = async (req, res) => {
  try {
    const families = await Family.find().sort({ createdAt: -1 });
    res.json(families);
  } catch (err) {
    res.status(500).json({ message: "Error fetching families" });
  }
};

export const getPendingFamilies = async (req, res) => {
  try {
    const families = await Family.find({ status: "pending" });
    res.json(families);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending families" });
  }
};

export const approveFamily = async (req, res) => {
  try {
    const family = await Family.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(family);
  } catch (err) {
    res.status(500).json({ message: "Error approving family" });
  }
};

export const deleteFamily = async (req, res) => {
  try {
    await Family.findByIdAndDelete(req.params.id);
    res.json({ message: "Family deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting family" });
  }
};


/* ============================================================
   ADMIN DASHBOARD STATS
============================================================ */

export const getAdminStats = async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();
    const pendingVolunteers = await Volunteer.countDocuments({ status: "pending" });
    const approvedVolunteers = await Volunteer.countDocuments({ status: "approved" });

    const totalFamilies = await Family.countDocuments();
    const pendingFamilies = await Family.countDocuments({ status: "pending" });
    const approvedFamilies = await Family.countDocuments({ status: "approved" });

    const totalCamps = await Camp.countDocuments();
    const activeCamps = await Camp.countDocuments({ isActive: true }); // assuming you have an isActive field

    res.json({
      totalVolunteers,
      pendingApprovals: pendingVolunteers,
      approvedVolunteers,
      totalFamilies,
      pendingFamilies,
      approvedFamilies,
      totalCamps,
      totalCamps,
      familiesHelped: approvedFamilies // optional: families helped = approved families
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   CAMP – ASSIGN / REMOVE VOLUNTEER
============================================================ */

export const assignVolunteerToCamp = async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;

    if (!campId || !volunteerId) {
      return res.status(400).json({ message: "campId and volunteerId are required" });
    }

    // Add volunteer to camp
    const camp = await Camp.findByIdAndUpdate(
      campId,
      { $addToSet: { volunteersAssigned: volunteerId } }, // prevents duplicate assignment
      { new: true }
    ).populate("volunteersAssigned", "name email");

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // Update volunteer
    await Volunteer.findByIdAndUpdate(volunteerId, { assignedCamp: campId });

    console.log(`Volunteer assigned to camp: ${camp.name}`);
    res.json({ message: "Volunteer assigned successfully", camp });

  } catch (error) {
    console.error("Error assigning volunteer:", error);
    res.status(500).json({ message: "Error assigning volunteer to camp" });
  }
};



export const removeVolunteerFromCamp = async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;

    if (!campId || !volunteerId) {
      return res.status(400).json({ message: "campId and volunteerId are required" });
    }

    // Remove volunteer from camp
    const camp = await Camp.findByIdAndUpdate(
      campId,
      { $pull: { volunteersAssigned: volunteerId } },
      { new: true }
    ).populate("volunteersAssigned", "name email");

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // Update volunteer side
    await Volunteer.findByIdAndUpdate(volunteerId, { assignedCamp: null });

    console.log(`Volunteer removed from camp`);
    res.json({ message: "Volunteer removed successfully", camp });

  } catch (error) {
    console.error("Error removing volunteer:", error);
    res.status(500).json({ message: "Error removing volunteer from camp" });
  }
};
