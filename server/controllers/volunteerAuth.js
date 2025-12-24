import Volunteer from "../models/Volunteer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER VOLUNTEER
export const volunteerRegister = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    // Optional: Only allow real volunteers (keep or remove)
    if (secretCode !== process.env.VOLUNTEER_SECRET) {
      return res.status(403).json({ message: "Invalid Volunteer Authorization Code" });
    }

    // Check if email already exists
    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Volunteer already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create volunteer → directly active
    const newVolunteer = new Volunteer({
      name,
      email,
      password: hashed,
      status: "active"   // 💥 Directly active — no admin needed
    });

    await newVolunteer.save();

    res.status(201).json({
      message: "Volunteer registered successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN VOLUNTEER
export const volunteerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Volunteer.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Volunteer not found" });

    // No approval check here — removed ✔
    // if (user.status !== "active") ...

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email/password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
