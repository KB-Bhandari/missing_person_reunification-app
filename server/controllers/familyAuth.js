import Family from "../models/family.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER FAMILY
export const familyRegister = async (req, res) => {
  try {
    const { name, email, password, phone, relation, address } = req.body;

    // Check if email already exists
    const existing = await Family.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Family already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create family user → directly active
    const newFamily = new Family({
      name,
      email,
      password: hashed,
      phone,
      relation,
      address,
      status: "active"   // Directly active (no admin approval)
    });

    await newFamily.save();

    res.status(201).json({
      message: "Family registered successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during family registration" });
  }
};

// LOGIN FAMILY
export const familyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Family.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Family user not found" });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email/password" });

    // Token create
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Family login successful",
      token,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during family login" });
  }
};
