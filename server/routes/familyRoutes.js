import express from "express";
import { familyLogin, familyRegister } from "../controllers/familyAuth.js";

const router = express.Router();

router.post("/register", familyRegister);
router.post("/login", familyLogin);

export default router;
