import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  relation: String,        // e.g. Father, Mother, Brother
  address: String,
  role: { type: String, default: "family" },
  status: { type: String, default: "active" } 
  // pending | active | rejected
});

// Prevent OverwriteModelError
export default mongoose.models.Family ||
  mongoose.model("Family", familySchema);
