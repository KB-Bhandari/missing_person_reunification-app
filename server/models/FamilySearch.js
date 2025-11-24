import mongoose from "mongoose";

const familySearchSchema = new mongoose.Schema({
  fullName: String,
  approxAge: String,
  lastSeenLocation: String,
  dateLastSeen: String,
  photo: String,
  familyUserId: String,
  status: { type: String, default: "pending" },  // pending / matched
  matchedPersonId: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("FamilySearch", familySearchSchema);
