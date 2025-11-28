import FamilySearch from "../models/FamilySearch.js";
import Person from "../models/personModels.js";
 // missing persons by volunteers

// Basic similarity function (name + location)
function isMatch(family, volunteer) {
  const nameMatch = volunteer.fullName.toLowerCase().includes(family.fullName.toLowerCase());

  const ageDiff = Math.abs(Number(volunteer.age) - Number(family.approxAge)) <= 5;

  const locationMatch = volunteer.lastSeenLocation
    .toLowerCase()
    .includes(family.lastSeenLocation.toLowerCase());

  return (nameMatch || ageDiff || locationMatch);
}


// ----------------------
// Search API
// ----------------------
export const searchMissingPerson = async (req, res) => {
  try {
    const { fullName, approxAge, lastSeenLocation, dateLastSeen, familyUserId } = req.body;

    // 1️⃣ Volunteer DB me match dhundo
    const volunteers = await VolunteerPerson.find();

    let foundMatch = null;

    volunteers.forEach((v) => {
      if (isMatch({ fullName, approxAge, lastSeenLocation }, v)) {
        foundMatch = v;
      }
    });

    // 2️⃣ If match found → return result
    if (foundMatch) {
      return res.json({
        status: "match",
        data: foundMatch,
      });
    }

    // 3️⃣ If no match → save search
    const newSearch = await FamilySearch.create({
      fullName,
      approxAge,
      lastSeenLocation,
      dateLastSeen,
      familyUserId,
      photo: req.file ? req.file.filename : null,
    });

    return res.json({
      status: "no_match",
      message: "No match found. Search saved.",
      savedSearch: newSearch,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
