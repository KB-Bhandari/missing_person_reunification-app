import mongoose from "mongoose";

const campSchema = new mongoose.Schema({
  campName: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  contactPerson: { type: String },
  phone: { type: String },
});

export default mongoose.model("Camp", campSchema);
