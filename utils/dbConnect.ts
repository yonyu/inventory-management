import mongoose from "mongoose";

const dbConnect = async ()=> {

    if (mongoose.connection.readyState >= 1) {
        //console.log("Already connected to MongoDB")
        return;
    }

    console.log("Connecting to MongoDB");
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}

export default dbConnect;
