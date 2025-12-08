import mongoose from "mongoose";
import { MdLeaderboard } from "react-icons/md";

const campSchema = new mongoose.Schema({
  leaderName: { type: String, required: true },
  campName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  contactPerson: { type: String },
  phone: { type: String },
});

export default mongoose.model("Camp", campSchema);
