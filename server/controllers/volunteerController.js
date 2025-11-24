import FamilySearch from "../models/FamilySearch.js";

// Volunteer new missing person add karta hai
export const addMissingPerson = async (req, res) => {
  try {
    const person = new VolunteerPerson({
      fullName: req.body.fullName,
      age: req.body.age,
      lastSeenLocation: req.body.lastSeenLocation,
      photo: req.file ? req.file.filename : null
    });

    const savedPerson = await person.save();

    // Auto-check with saved family searches
    const searches = await FamilySearch.find({ status: "pending" });

    searches.forEach(async (s) => {
      if (isMatch(s, savedPerson)) {
        s.status = "matched";
        s.matchedPersonId = savedPerson._id;
        await s.save();
      }
    });

    res.json({
      message: "Volunteer person added + auto-match checked",
      data: savedPerson
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot add person" });
  }
};
