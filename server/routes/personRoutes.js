import multer from "multer";
import Person from "../models/personModels.js";
import express from "express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST - Register a person
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 Received Data:", req.body);
    console.log("📸 Image:", req.file);

    const newPerson = new Person({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
      description: req.body.description,
      image: req.file ? req.file.buffer : undefined,
    });

    await newPerson.save();
    res.status(201).json({ message: "Person registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering person:", error);
    res.status(500).json({ message: error.message });
  }
});

// 👇 ADD THIS (GET route)
router.get("/", async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
