import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI){
            throw new Error("MongoURI is not found");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        if (error instanceof Error) {  // Check if error is an instance of the Error class
            console.log(`Error connecting to mongoDB: ${error.message}`);
        } else {
            console.log("Unknown error occurred while connecting to mongoDB");
        }
        process.exit(1);
    }
}