import mongoose from "mongoose";

function connectDB() {
  mongoose
    .connect(process.env.MOGNO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.log("MongoDB connection failed", err);
    });
}

export default connectDB;
