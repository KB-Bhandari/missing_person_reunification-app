import express from "express";
import Person from "../models/personModels.js";
import { upload } from "../middleware/upload.js";  // use middleware only

const router = express.Router();


// POST - Register a person
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


// GET all persons
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

export default router;
