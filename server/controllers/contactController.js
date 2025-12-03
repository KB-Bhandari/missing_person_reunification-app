import Contact from "../models/contact.js";

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await Contact.create({ name, email, message });

    res.json({ success: true, message: "Message saved successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
