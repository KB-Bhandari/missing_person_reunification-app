import mongoose from "mongoose";

const foundPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  status: { type: String, enum: ["missing", "found"], default: "missing" },
});

// Change "FoundPerson" as the model name and "foundpersons" as the MongoDB collection name
export default mongoose.model("FoundPerson", foundPersonSchema, "foundPersons");
