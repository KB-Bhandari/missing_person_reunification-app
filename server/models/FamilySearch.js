import mongoose from "mongoose";

const familySearchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    approxAge: { type: String, required: true },
    lastSeenLocation: { type: String, required: true },
    dateLastSeen: { type: String, required: true },
  gender: {type: String, enum: ["male", "female", "other"], required: true,},
    description: { type: String },

    photo: { type: String, required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FamilySearch", familySearchSchema);
