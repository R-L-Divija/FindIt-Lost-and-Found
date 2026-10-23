const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.warn("Primary MongoDB connection timed out:", error.message);
        console.log("Attempting fallback to local MongoDB...");
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/lostandfound");
            console.log("Local MongoDB connected successfully");
        } catch (localErr) {
            console.error("MongoDB connection failed:", localErr.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;