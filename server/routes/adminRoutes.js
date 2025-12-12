import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminStats,
  getPendingVolunteers,
  approveVolunteer,
  rejectVolunteer,
  getAllVolunteers,
  deleteVolunteer,
  addVolunteer,
  // Camp management
  getAllCamps,
  getCampById,
  createCamp,
  updateCamp,
  deleteCamp,
  assignVolunteerToCamp,
  removeVolunteerFromCamp,
  // Family management
  getAllFamilies,
  getPendingFamilies,
  approveFamily,
  deleteFamily,
  
} from "../controllers/adminController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== PUBLIC AUTH ROUTES ====================
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);

// ==================== PROTECTED ADMIN ROUTES ====================

// Dashboard Stats
router.get("/stats", requireAdmin, getAdminStats);

// ==================== VOLUNTEER MANAGEMENT ====================
router.get("/pending-volunteers", requireAdmin, getPendingVolunteers);
router.get("/volunteers", requireAdmin, getAllVolunteers);
router.put("/approve/:id", requireAdmin, approveVolunteer);
router.put("/reject/:id", requireAdmin, rejectVolunteer);
router.delete("/volunteers/:id", requireAdmin, deleteVolunteer);
router.post("/volunteers/add", requireAdmin, addVolunteer);
router.post("/camps/assign-volunteer", requireAdmin, assignVolunteerToCamp);
router.post("/camps/remove-volunteer", requireAdmin, removeVolunteerFromCamp);


// ==================== CAMP MANAGEMENT ====================
router.get("/camps", requireAdmin, getAllCamps);
router.get("/camps/:id", requireAdmin, getCampById);
router.post("/camps", requireAdmin, createCamp);
router.put("/camps/:id", requireAdmin, updateCamp);
router.delete("/camps/:id", requireAdmin, deleteCamp);

// Camp-Volunteer Assignment (inline handlers)
router.post("/camps/assign-volunteer", requireAdmin, async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;
    const Camp = (await import("../models/Camp.js")).default;
    const Volunteer = (await import("../models/volunteer.js")).default;
    
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
});

router.post("/camps/remove-volunteer", requireAdmin, async (req, res) => {
  try {
    const { campId, volunteerId } = req.body;
    const Camp = (await import("../models/Camp.js")).default;
    const Volunteer = (await import("../models/volunteer.js")).default;
    
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
});

// ==================== FAMILY MANAGEMENT ====================
router.get("/families", requireAdmin, getAllFamilies);
router.get("/pending-families", requireAdmin, getPendingFamilies);
router.put("/families/approve/:id", requireAdmin, approveFamily);
router.delete("/families/:id", requireAdmin, deleteFamily);

export default router;