import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const URI = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(URI);  /* , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        */
        console.log("✅  MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};