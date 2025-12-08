import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  image: {
  type: String,
  required: true
}
, 
  status: { type: String, enum: ["missing", "found"], default: "missing" }
});

export default mongoose.model("Person", personSchema);
