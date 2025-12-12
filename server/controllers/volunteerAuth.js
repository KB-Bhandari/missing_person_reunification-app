import Volunteer from "../models/volunteer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------ REGISTER VOLUNTEER ------------------
export const volunteerRegister = async (req, res) => {
  try {
    const {
      name, email, password, phone, dateOfBirth, gender,
      address, city, state, pincode,
      idType, idNumber,
      occupation, skills, experience, availability,
      emergencyContact, emergencyPhone,
      reasonToVolunteer, termsAccepted
    } = req.body;

    // Validate minimal required fields
    if (!name || !email || !password || !phone || !dateOfBirth || !gender ||
        !address || !city || !state || !pincode ||
        !idType || !idNumber || !occupation || !skills || skills.length === 0 ||
        !availability || !emergencyContact || !emergencyPhone || !termsAccepted) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!termsAccepted) return res.status(400).json({ message: "You must accept terms" });

    // Check email and ID uniqueness
    if (await Volunteer.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    if (await Volunteer.findOne({ idNumber })) return res.status(400).json({ message: "ID already registered" });

    // Check age >= 18
    const birthDate = new Date(dateOfBirth);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const monthDiff = new Date().getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < birthDate.getDate())) age--;
    if (age < 18) return res.status(400).json({ message: "Must be at least 18 years old" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create volunteer
    const newVolunteer = new Volunteer({
      name, email, password: hashedPassword, phone, dateOfBirth, gender,
      address, city, state, pincode,
      idType, idNumber,
      occupation, skills, experience: experience || "", availability,
      emergencyContact, emergencyPhone,
      reasonToVolunteer: reasonToVolunteer || "",
      termsAccepted,
      status: "pending",
      role: "volunteer"
    });

    await newVolunteer.save();

    res.status(201).json({
      message: "Registration submitted successfully! Pending admin approval.",
      volunteerId: newVolunteer._id
    });

  } catch (error) {
    console.error("Volunteer registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ------------------ LOGIN VOLUNTEER ------------------
// LOGIN VOLUNTEER - Only approved volunteers can login
export const volunteerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const volunteer = await Volunteer.findOne({ email });
    console.log("Volunteer found:", volunteer);

    if (!volunteer) return res.status(400).json({ message: "Invalid email or password" });

    console.log("Volunteer status:", volunteer.status);
    
    // status checks
    if (volunteer.status !== "active") {
      return res.status(403).json({ message: `Your account is ${volunteer.status}` });
    }

    const isPasswordValid = await bcrypt.compare(password, volunteer.password);
    console.log("Password valid?", isPasswordValid);

    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign(
  { id: volunteer._id.toString(), role: volunteer.role, status: volunteer.status },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  message: "Login successful",
  token,
  volunteer: {
    id: volunteer._id.toString(),
    name: volunteer.name,
    email: volunteer.email,
    phone: volunteer.phone,
    skills: volunteer.skills,
    assignedCamp: volunteer.assignedCamp ? volunteer.assignedCamp.toString() : null,
    status: volunteer.status
  }
});

  } catch (err) {
    console.error("Volunteer login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
