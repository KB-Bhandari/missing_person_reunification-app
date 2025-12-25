import Family from "../models/family.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const familyRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await Family.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);

    const newFamily = new Family({
      name,
      email,
      password: hashed,
      phone,
    });

    await newFamily.save();

    res.json({ message: "Family registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const familyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const family = await Family.findOne({ email });

    if (!family || !(await bcrypt.compare(password, family.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ MATCH THE MIDDLEWARE: Use 'id' and 'role'
   const token = jwt.sign(
      { id: family._id, role: "family" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token: token, // This sends the actual string to the frontend
      name: family.name
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login error" });
  }
};