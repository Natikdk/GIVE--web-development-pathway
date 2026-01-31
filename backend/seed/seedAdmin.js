
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

console.log('Creating admin account...');
console.log('Loading .env from:', envPath);
console.log('MONGO_URI loaded?', !!process.env.MONGO_URI);
console.log('Mongoose version:', mongoose.version);

async function createAdmin() {
  try {
    
    if (!process.env.MONGO_URI) {
      console.error('\n MONGO_URI is not defined!');
      process.exit(1);
    }
    
    console.log('\n Connecting to MongoDB...');
    
    try {
      
      await mongoose.connect(process.env.MONGO_URI);
      console.log(' Connected to MongoDB successfully (simple connect)');
    } catch (simpleError) {
      console.log('Simple connect failed, trying with server timeout...');
      
     
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('Connected to MongoDB successfully (with timeout option)');
    }
    
   
    const Admin = require('../src/models/Admin');
    
    
    console.log('\n🔍 Checking for existing admin...');
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: 'admin@learningcenter.com' },
        { username: 'admin' }
      ] 
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists!');
      console.log('\n📋 Existing Admin Details:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      console.log('   Role:', existingAdmin.role);
      console.log('   Created:', existingAdmin.createdAt ? existingAdmin.createdAt.toLocaleDateString() : 'N/A');
      
      console.log('\n💡 What to do:');
      console.log('   1. Use these credentials to login');
      console.log('   2. Or if you forgot password, run: node seed/resetAdminPassword.js');
    } else {
      console.log('No existing admin found. Creating new admin...');
      
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      
      const admin = new Admin({
        username: 'admin',
        email: 'admin@learningcenter.com',
        password: hashedPassword,
        role: 'super-admin'
      });
      
      await admin.save();
      
      console.log('\n🎉 ADMIN CREATED SUCCESSFULLY!');

      console.log('   📧 Email: admin@learningcenter.com');
      console.log('   🔑 Password: admin123');
      console.log('   👤 Username: admin');
      console.log('   ⭐ Role: super-admin');
      console.log('   🆔 ID:', admin._id);
  
      
      console.log('\n SECURITY ALERT:');
      console.log('   1. Change this password immediately after first login!');
      console.log('   2. Never share these credentials');
    }
    
    
    console.log('\n All Admin Accounts:');
    const allAdmins = await Admin.find({}, 'username email role createdAt');
    if (allAdmins.length === 0) {
      console.log('   No admin accounts found');
    } else {
      allAdmins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.username} (${admin.email}) - ${admin.role}`);
      });
    }
    
  } catch (error) {
    console.error('\n ERROR:', error.message);
    
    if (error.code === 11000) {
      console.log('Duplicate key error - admin with this email or username already exists');
    } else if (error.message.includes('timed out')) {
      console.log('Connection timeout - check your internet and MongoDB Atlas settings');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('Authentication failed - check MongoDB username/password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('Cannot connect to MongoDB - check your network connection');
    } else if (error.message.includes('options usenewurlparser')) {
      console.log(' Update your other files too!');
      console.log('   Remove useNewUrlParser and useUnifiedTopology options from:');
      console.log('   1. src/config/db.js');
      console.log('   2. seed/seedCSSLesson.js');
      console.log('   3. seed/seedJavascriptLesson.js');
      console.log('   4. Any other mongoose.connect() calls');
    }
    
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the function
createAdmin();