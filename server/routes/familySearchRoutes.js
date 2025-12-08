import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { saveFamilySearch } from "../controllers/familySearchController.js";

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

router.post("/save", upload.single("photo"), saveFamilySearch);

export default router;
