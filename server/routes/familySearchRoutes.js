import express from "express";
import multer from "multer";
import { searchMissingPerson } from "../controllers/familySearchController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/search", upload.single("photo"), searchMissingPerson);

export default router;

