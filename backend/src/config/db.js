const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const mongoUri = process.env.MONGO_URI 
    
    if (!mongoUri) {
      console.error('❌ No MongoDB connection string found in environment variables');
      console.error('Please set MONGO_URI in your .env file');
      process.exit(1);
    }
    
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log(`Connection string: ${mongoUri.substring(0, 30)}...`);
    
    // Remove useNewUrlParser and useUnifiedTopology - they're not needed in newer versions
    const conn = await mongoose.connect(mongoUri, {
      // Optional: Add these if you have connection issues
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;