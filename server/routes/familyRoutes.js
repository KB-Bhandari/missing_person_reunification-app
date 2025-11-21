import express from "express";
import { familyLogin, familyRegister } from "../controllers/familyAuth.js";

const router = express.Router();

router.post("/login", familyLogin);
router.post("/register", familyRegister);

export default router;
