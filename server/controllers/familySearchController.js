import FamilySearch from "../models/FamilySearch.js";

export const saveFamilySearch = async (req, res) => {
  try {
    const { name, approxAge, description, lastSeenLocation, lastSeenDate } =
      req.body;

    const photo = req.file ? req.file.filename : null;

    const newEntry = new FamilySearch({
      name,
      approxAge,
      description,
      lastSeenLocation,
      lastSeenDate,
      photo,
    });

    await newEntry.save();

    res.json({
      success: true,
      message: "Data saved successfully!",
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
