import Family from "../models/Family.js";
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
    if (!family) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, family.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: family._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Family login successful",
      token,
      name: family.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};
