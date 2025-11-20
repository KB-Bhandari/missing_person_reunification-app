import express from "express";
import { volunteerLogin, volunteerRegister } from "../controllers/volunteerAuth.js";

const router = express.Router();

router.post("/login", volunteerLogin);
router.post("/register", volunteerRegister);

export default router;
