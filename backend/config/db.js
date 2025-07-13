// backend/src/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB ➜ ${conn.connection.host}`);
  } catch (err) {
    console.error('Mongo bağlantı hatası:', err.message);
    process.exit(1);
  }
};
