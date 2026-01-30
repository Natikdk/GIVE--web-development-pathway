
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Contact = require("../models/Contact");
const Lesson = require("../models/Lesson");
const auth = require("../middleware/auth");




router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

   
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

  
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Get admin profile
router.get("/profile", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

//dashboard stats
router.get("/dashboard/stats", auth, async (req, res) => {
  try {
    const [
      totalLessons,
      totalContacts,
      newContacts,
      repliedContacts
    ] = await Promise.all([
      Lesson.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'replied' })
    ]);

    res.json({
      success: true,
      stats: {
        totalLessons,
        totalContacts,
        newContacts,
        repliedContacts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// contact management routes


router.get("/contacts", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    
    //by the way aron  this is for your filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by name, email, or subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Get single contact
router.get("/contacts/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    res.json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Update contact status/notes
router.patch("/contacts/:id", auth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'replied') {
        updateData.repliedAt = new Date();
      }
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    res.json({
      success: true,
      message: "Contact updated",
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ===== LESSON MANAGEMENT =====

// Get all lessons for admin
router.get("/lessons", auth, async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Create new lesson
router.post("/lessons", auth, async (req, res) => {
  try {
    const { topic, slug, sections } = req.body;
    
    // Check if lesson with slug exists
    const existingLesson = await Lesson.findOne({ slug });
    if (existingLesson) {
      return res.status(400).json({
        success: false,
        message: "A lesson with this slug already exists"
      });
    }
    
    const lesson = new Lesson({
      topic,
      slug,
      sections
    });
    
    await lesson.save();
    
    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Update lesson
router.put("/lessons/:id", auth, async (req, res) => {
  try {
    const { topic, slug, sections } = req.body;
    
    // Check if slug is being changed and already exists
    if (slug) {
      const existingLesson = await Lesson.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      if (existingLesson) {
        return res.status(400).json({
          success: false,
          message: "A lesson with this slug already exists"
        });
      }
    }
    
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { topic, slug, sections },
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }
    
    res.json({
      success: true,
      message: "Lesson updated successfully",
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Delete lesson
router.delete("/lessons/:id", auth, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }
    
    res.json({
      success: true,
      message: "Lesson deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;