// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import familySearchRoutes from "./routes/familySearchRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import personRoutes from "./routes/personRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// STATIC UPLOADS PATH — IMPORTANT
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/foundPersons", express.static(path.join(__dirname, "uploads/foundPersons")));

// CONNECT TO MONGO
mongoose
  .connect(process.env.MONGO_URI, { dbName: "personDB" })
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ROUTES
app.use("/api/persons", personRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/familySearch", familySearchRoutes);  // 👈 IMPORTANT
app.use("/api/contact", contactRoutes);

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
