import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Volunteer from "../models/volunteer.js";
import Family from "../models/family.js";

// ====================== Generic Auth Middleware ======================
export const requireAuth = (role) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];

      // ✅ Access JWT_SECRET inside function
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("❌ JWT_SECRET is not defined in .env");
        return res.status(500).json({ message: "Server misconfiguration" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      req.userId = decoded.id;
      req.role = decoded.role;

      if (decoded.role === "admin") req.user = await Admin.findById(decoded.id);
      if (decoded.role === "volunteer") req.user = await Volunteer.findById(decoded.id);
      if (decoded.role === "family") req.user = await Family.findById(decoded.id);

      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

// ====================== Specific Role Middlewares ======================
export const requireAdmin = requireAuth("admin");
export const requireVolunteer = requireAuth("volunteer");
export const requireFamily = requireAuth("family");
