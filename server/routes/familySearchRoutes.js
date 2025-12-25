import express from "express";
import multer from "multer";
import path from "path";
import { requireFamily } from "../middleware/authMiddleware.js";
import { fileURLToPath } from "url";
import {
  saveFamilySearch,
  getMyFamilySearches,
} from "../controllers/familySearchController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "..", "uploads", "familySearch");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/save",   requireFamily,  upload.single("photo"), saveFamilySearch);

router.get("/my",  requireFamily, getMyFamilySearches);

export default router;
