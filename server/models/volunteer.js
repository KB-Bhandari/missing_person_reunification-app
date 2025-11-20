import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: String,
  assignedCamp: String,
  status: { type: String, default: "active" }
// pending | active | rejected
});

// Prevent OverwriteModelError
export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", volunteerSchema);
