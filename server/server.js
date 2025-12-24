import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import personRoutes from "./routes/personRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();               // <-- create app before using it
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to personDB 🚀"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

app.use("/api/persons", personRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));