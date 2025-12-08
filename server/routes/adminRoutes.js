import express from "express";
import { addVolunteer, getPendingVolunteers, approveVolunteer } from "../controllers/adminController.js";


const router = express.Router();

// router.get("/pending-volunteers", getPendingVolunteers);
// router.put("/approve/:id", approveVolunteer);

export default router;
