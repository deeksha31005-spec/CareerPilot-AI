import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses free local MongoDB database or MongoDB Atlas connection URI
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Optional fallback message for local setup guidance
    console.log('💡 Tip: Ensure MongoDB service is running locally or provide a valid MONGO_URI in backend/.env');
    process.exit(1);
  }
};
