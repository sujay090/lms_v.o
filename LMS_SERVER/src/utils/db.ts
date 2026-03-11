import mongoose from "mongoose";
import { initializeAllTenantsData } from "./initializeAllTenants";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("MongoDB connected");
        await initializeAllTenantsData();
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}