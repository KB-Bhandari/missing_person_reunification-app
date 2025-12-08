import mongoose from "mongoose";

const familySearchSchema = new mongoose.Schema(
  {
    name: { type: String },
    approxAge: { type: String },
    additionalDetails: { type: String },
    lastSeenLocation: { type: String },
    dateLastSeen: { type: String },
    photoPath: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("FamilySearch", familySearchSchema);
