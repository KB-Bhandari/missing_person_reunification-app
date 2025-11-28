import express from "express";
import Person from "../models/personModels.js";
import { upload } from "../middleware/upload.js";  // use middleware only

const router = express.Router();



// ✅ 1) REGISTER PERSON (Volunteer Panel)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newPerson = new Person({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
      description: req.body.description,
      image: req.file ? req.file.filename : null,

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

    const formatted = persons.map((p) => ({
      ...p._doc,
      image: p.image || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({ message: error.message });
  }
});


// DELETE - Remove person
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Person.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting person:", error);
    res.status(500).json({ message: "Server error" });
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
