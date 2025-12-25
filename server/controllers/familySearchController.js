import FamilySearch from "../models/FamilySearch.js";

export const saveFamilySearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const newSearch = new FamilySearch({
      name: req.body.name,
      approxAge: req.body.approxAge,
      gender: req.body.gender,
      lastSeenLocation: req.body.lastSeenLocation,
      dateLastSeen: req.body.dateLastSeen,
      description: req.body.description || "",
      photo: req.file.filename,
      submittedBy: req.userId,
    });

    await newSearch.save();

    res.json({ success: true, familysearch: newSearch });
  } catch (err) {
    console.error("saveFamilySearch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// FETCH logged-in user's records
export const getMyFamilySearches = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const searches = await FamilySearch
      .find({ submittedBy: req.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, familysearches: searches });
  } catch (err) {
    console.error("getMyFamilySearches error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
