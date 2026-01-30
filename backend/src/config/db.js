
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        console.log('Connecting to MongoDB...');
        
       
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(` Database: ${conn.connection.name}`);
        
        return conn;
        
    } catch (err) {
        console.error(' MongoDB connection FAILED:', err.message);
        
        
        process.exit(1);
    }
};

module.exports = connectDB;