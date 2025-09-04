import mongoose from "mongoose";

export const connectDB = async (mongoUrl) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUrl, {
    autoIndex: true
  });
  console.log("✅ MongoDB connected");
};
