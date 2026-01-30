const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");



router.get("/", async (req, res) => {
  try {
   
    const lessons = await Lesson.find({}).select("topic slug sections");
    
   
    
    res.json(lessons);
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ message: err.message });
  }
});


router.get("/:slug", async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

   
    res.json(lesson);
  } catch (err) {
    console.error('Error fetching lesson:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const lesson = new Lesson({
      topic: req.body.topic,
      slug: req.body.slug,
      sections: req.body.sections,
    });

    const savedLesson = await lesson.save();
    res.status(201).json(savedLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
