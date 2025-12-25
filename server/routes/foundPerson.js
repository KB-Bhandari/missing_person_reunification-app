import express from "express";
import FoundPerson from "../models/FoundPerson.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET all persons
router.get("/", async (req, res) => {
  try {
    const persons = await FoundPerson.find().sort({ createdAt: -1 });

    // ✅ IMPORTANT: Return ONLY the filename, not full path
    // The frontend will construct the full URL
    const formatted = persons.map((p) => ({
      ...p._doc,
      image: p.image || null, // Just the filename: "1702345678901.jpg"
    }));

    console.log(`✅ Fetched ${formatted.length} persons`);
    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({ message: error.message });
  }
});

// CREATE person (Volunteer Panel)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📁 Uploaded file:", req.file);
    console.log("📝 Request body:", req.body);

    const newPerson = new FoundPerson({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      // ✅ Store ONLY filename, not full path
      image: req.file ? req.file.filename : null,
      status: req.body.status || "missing",
    });

    await newPerson.save();
    console.log("✅ Person created:", newPerson.name);
    
    res.status(201).json({ 
      message: "Person registered successfully!",
      person: {
        ...newPerson._doc,
        image: newPerson.image // Just filename
      }
    });
  } catch (error) {
    console.error("❌ Error creating person:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE person
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await FoundPerson.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Person not found" });
    }

    console.log("✅ Person deleted:", deleted.name);
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting person:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// SEARCH person by name (Family Search)
router.get("/search", async (req, res) => {
  try {
    const nameQuery = req.query.name?.toLowerCase().trim();

    if (!nameQuery) {
      return res.status(400).json({ message: "Name is required for search." });
    }

    console.log("🔍 Searching for:", nameQuery);

    const persons = await FoundPerson.find();

    // Simple name matching (partial/contains)
    const matched = persons.filter((p) =>
      p.name.toLowerCase().includes(nameQuery)
    );

    console.log(`✅ Found ${matched.length} matches`);

    if (matched.length > 0) {
      return res.json({
        matchFound: true,
        matchedPersons: matched.map(p => ({
          ...p._doc,
          image: p.image // Just filename
        })),
      });
    }

    // No match found
    return res.json({
      matchFound: false,
      matchedPersons: [],
      message: `No persons found matching "${req.query.name}"`
    });
  } catch (error) {
    console.error("❌ Error searching person:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET single person by ID
router.get("/:id", async (req, res) => {
  try {
    const person = await FoundPerson.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.json({
      ...person._doc,
      image: person.image // Just filename
    });
  } catch (error) {
    console.error("❌ Error fetching person:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE person
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      location: req.body.location,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      status: req.body.status,
    };

    // Only update image if new file uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedPerson = await FoundPerson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    console.log("✅ Person updated:", updatedPerson.name);
    res.json({ 
      message: "Person updated successfully",
      person: {
        ...updatedPerson._doc,
        image: updatedPerson.image
      }
    });
  } catch (error) {
    console.error("❌ Error updating person:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;