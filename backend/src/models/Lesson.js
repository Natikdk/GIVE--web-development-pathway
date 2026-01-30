//eziga update argewalew aron
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  anchor: {
    type: String,
    required: true,
  },
  hasPlayground: { type: Boolean, default: false },
  playground: {
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' },
    instructions: { type: String, default: '' }
  },
  quiz: {
    enabled: { type: Boolean, default: false },
    questions: [{
      id: String,
      question: String,
      type: { type: String, default: 'multiple-choice' },
      options: [{
        id: String,
        text: String,
        correct: Boolean
      }],
      explanation: String,
      difficulty: { type: String, default: 'medium' }
    }],
    passingScore: { type: Number, default: 70 },
    showResults: { type: Boolean, default: true }
  },
  hasVideo: { type: Boolean, default: false },
  video: {
  youtubeId: String,           
  title: String,              
  description: String,        
  startTime: Number,       
  endTime: Number            
}
});

const lessonSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sections: [sectionSchema],
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("Lesson", lessonSchema);