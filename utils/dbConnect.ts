import mongoose from "mongoose";

const dbConnect = async ()=> {

    // if (mongoose.connection.readyState >= 1) {
    //     //console.log("Already connected to MongoDB")
    //     return;
    // }

    console.log("Connecting to MongoDB");
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:");
        console.error("- Check if MongoDB is running");
        console.error("- Verify MONGODB_URI in environment variables");
        console.error("- Error details:", error);
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export default dbConnect;
