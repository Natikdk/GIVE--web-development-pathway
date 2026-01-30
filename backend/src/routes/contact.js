
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");


router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

   
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and message" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    //Save to database
    const contact = new Contact({
      name,
      email,
      subject: subject || '',
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email
      }
    });

  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

module.exports = router;