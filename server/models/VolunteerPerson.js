import mongoose from "mongoose";

const volunteerPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  location: { type: String },
  description: { type: String },
  image: { type: Buffer }, // buffer image
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer"
  }, // kis volunteer ne upload kiya
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite error
export default mongoose.models.VolunteerPerson ||
  mongoose.model("VolunteerPerson", volunteerPersonSchema);
