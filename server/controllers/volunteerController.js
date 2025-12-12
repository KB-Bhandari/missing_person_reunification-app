import Admin from "../models/admin.js";
import Volunteer from "../models/volunteer.js";
import Camp from "../models/Camp.js"; // Add your Camp model
import Family from "../models/family.js"; // Add your Family model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================== ADMIN REGISTER =====================
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

// ===================== ADMIN LOGIN =====================
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

// ===================== ADMIN STATS =====================
export const getAdminStats = async (req, res) => {
  try {
    // Volunteer stats
    const totalVolunteers = await Volunteer.countDocuments({ status: "active" });
    const pendingApprovals = await Volunteer.countDocuments({ status: "pending" });
    const approvedVolunteers = await Volunteer.countDocuments({ status: "approved" });
    const rejectedVolunteers = await Volunteer.countDocuments({ status: "rejected" });
    
    // Camp stats
    const activeCamps = await Camp.countDocuments({ status: "active" });
    const totalCamps = await Camp.countDocuments();
    
    // Family stats
    const familiesHelped = await Family.countDocuments({ status: "helped" });
    const totalFamilies = await Family.countDocuments();
    const pendingFamilies = await Family.countDocuments({ status: "pending" });

    res.json({
      totalVolunteers,
      pendingApprovals,
      activeCamps,
      familiesHelped,
      // Additional stats
      approvedVolunteers,
      rejectedVolunteers,
      totalCamps,
      totalFamilies,
      pendingFamilies
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== GET PENDING VOLUNTEERS =====================
export const getPendingVolunteers = async (req, res) => {
  try {
    const pending = await Volunteer.find({ status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${pending.length} pending volunteers`);
    res.json(pending);
  } catch (error) {
    console.error("❌ Error fetching pending volunteers:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== GET ALL VOLUNTEERS =====================
export const getAllVolunteers = async (req, res) => {
  try {
    const all = await Volunteer.find()
      .select("-password")
      .populate("assignedCamp", "name location")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${all.length} total volunteers`);
    res.json(all);
  } catch (error) {
    console.error("❌ Error fetching all volunteers:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== APPROVE VOLUNTEER =====================
export const approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { 
        status: "active",
        approvedAt: new Date(),
        approvedBy: req.admin?._id || req.user?._id
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    console.log(`✅ Volunteer approved: ${volunteer.name} (${volunteer.email})`);
    res.status(200).json(volunteer);
  } catch (err) {
    console.error("❌ Error approving volunteer:", err);
    res.status(500).json({ message: "Error approving volunteer" });
  }
};

// ===================== REJECT VOLUNTEER =====================
export const rejectVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { 
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: req.admin?._id || req.user?._id,
        rejectionReason: reason || "Application not approved"
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    console.log(`✅ Volunteer rejected: ${volunteer.name} (${volunteer.email})`);
    res.status(200).json(volunteer);
  } catch (err) {
    console.error("❌ Error rejecting volunteer:", err);
    res.status(500).json({ message: "Error rejecting volunteer" });
  }
};

// ===================== DELETE VOLUNTEER =====================
export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findByIdAndDelete(id);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    console.log(`✅ Volunteer deleted: ${volunteer.name} (${volunteer.email})`);
    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting volunteer:", err);
    res.status(500).json({ message: "Error deleting volunteer" });
  }
};

// ===================== ADD VOLUNTEER MANUALLY =====================
export const addVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    console.log(`✅ Volunteer added manually: ${volunteer.name}`);
    res.status(201).json(volunteer);
  } catch (err) {
    console.error("❌ Error adding volunteer:", err);
    res.status(500).json({ message: "Error adding volunteer" });
  }
};

// ===================== CAMP MANAGEMENT =====================

// Get all camps
export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find()
      .populate("volunteersAssigned", "name email phone")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${camps.length} camps`);
    res.json(camps);
  } catch (error) {
    console.error("❌ Error fetching camps:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single camp
export const getCampById = async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await Camp.findById(id)
      .populate("volunteersAssigned", "name email phone skills");
    
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    
    res.json(camp);
  } catch (error) {
    console.error("❌ Error fetching camp:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create camp
export const createCamp = async (req, res) => {
  try {
    const camp = await Camp.create(req.body);
    console.log(`✅ Camp created: ${camp.name}`);
    res.status(201).json(camp);
  } catch (err) {
    console.error("❌ Error creating camp:", err);
    res.status(500).json({ message: "Error creating camp" });
  }
};

// Update camp
export const updateCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await Camp.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    
    console.log(`✅ Camp updated: ${camp.name}`);
    res.json(camp);
  } catch (err) {
    console.error("❌ Error updating camp:", err);
    res.status(500).json({ message: "Error updating camp" });
  }
};

// Delete camp
export const deleteCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await Camp.findByIdAndDelete(id);
    
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    
    console.log(`✅ Camp deleted: ${camp.name}`);
    res.json({ message: "Camp deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting camp:", err);
    res.status(500).json({ message: "Error deleting camp" });
  }
};

// Assign volunteer to camp
export const assignVolunteerToCamp = async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;
    
    // Update camp
    const camp = await Camp.findByIdAndUpdate(
      campId,
      { $addToSet: { volunteersAssigned: volunteerId } },
      { new: true }
    ).populate("volunteersAssigned", "name email");
    
    // Update volunteer
    await Volunteer.findByIdAndUpdate(volunteerId, { assignedCamp: campId });
    
    console.log(`✅ Volunteer assigned to camp: ${camp.name}`);
    res.json(camp);
  } catch (err) {
    console.error("❌ Error assigning volunteer:", err);
    res.status(500).json({ message: "Error assigning volunteer to camp" });
  }
};

// Remove volunteer from camp
export const removeVolunteerFromCamp = async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;
    
    // Update camp
    const camp = await Camp.findByIdAndUpdate(
      campId,
      { $pull: { volunteersAssigned: volunteerId } },
      { new: true }
    );
    
    // Update volunteer
    await Volunteer.findByIdAndUpdate(volunteerId, { assignedCamp: null });
    
    console.log(`✅ Volunteer removed from camp`);
    res.json(camp);
  } catch (err) {
    console.error("❌ Error removing volunteer:", err);
    res.status(500).json({ message: "Error removing volunteer from camp" });
  }
};

// ===================== FAMILY MANAGEMENT =====================

// Get all families
export const getAllFamilies = async (req, res) => {
  try {
    const families = await Family.find()
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${families.length} families`);
    res.json(families);
  } catch (error) {
    console.error("❌ Error fetching families:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get pending families
export const getPendingFamilies = async (req, res) => {
  try {
    const pending = await Family.find({ status: "pending" })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${pending.length} pending families`);
    res.json(pending);
  } catch (error) {
    console.error("❌ Error fetching pending families:", error);
    res.status(500).json({ message: error.message });
  }
};

// Approve family
export const approveFamily = async (req, res) => {
  try {
    const { id } = req.params;
    
    const family = await Family.findByIdAndUpdate(
      id,
      { 
        status: "approved",
        approvedAt: new Date(),
        approvedBy: req.admin?._id || req.user?._id
      },
      { new: true }
    );
    
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    
    console.log(`✅ Family approved: ${family.name}`);
    res.json(family);
  } catch (err) {
    console.error("❌ Error approving family:", err);
    res.status(500).json({ message: "Error approving family" });
  }
};

// Delete family
export const deleteFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const family = await Family.findByIdAndDelete(id);
    
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    
    console.log(`✅ Family deleted: ${family.name}`);
    res.json({ message: "Family deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting family:", err);
    res.status(500).json({ message: "Error deleting family" });
  }
};