import express from "express";
import Person from "../models/FoundPerson.js";

const router = express.Router();

router.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

router.get("/", async (req, res) => {
  try {
    const totalPersons = await Person.countDocuments();
    const maleCount = await Person.countDocuments({ gender: "Male" });
    const femaleCount = await Person.countDocuments({ gender: "Female" });
    const recentPersons = await Person.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("name age gender location status");

    // 📊 Chart Data Added
    const chart = {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "Gender Distribution",
          data: [maleCount, femaleCount],
          // No colors applied – leave it to frontend (as best practice)
        },
      ],
    };

    const dashboardData = {
      stats: { totalPersons, maleCount, femaleCount },
      recent: recentPersons,
      chart, //  <-- 🔹 Added here
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
