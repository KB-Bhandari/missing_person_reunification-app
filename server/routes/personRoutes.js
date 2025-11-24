import multer from "multer";
import Person from "../models/personModels.js";
import express from "express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// ✅ 1) REGISTER PERSON (Volunteer Panel)
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


// ✅ 2) GET ALL PERSONS
router.get("/", async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ 3) SEARCH PERSON (Family Search)
router.get("/search", async (req, res) => {
  try {
    const nameQuery = req.query.name?.toLowerCase();

    if (!nameQuery) {
      return res.status(400).json({ message: "Name is required." });
    }

    const persons = await Person.find();

    // SIMPLE NAME MATCHING (contains / partial matching)
    const matched = persons.filter((p) =>
      p.name.toLowerCase().includes(nameQuery)
    );

    if (matched.length > 0) {
      return res.json({
        matchFound: true,
        matchedPersons: matched,
      });
    }

    // NO MATCH FOUND
    return res.json({
      matchFound: false,
      matchedPersons: [],
    });
  } catch (error) {
    console.error("❌ Error searching person:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
