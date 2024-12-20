import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import contentRoutes from "./routes/contentRoutes";

import { connectDB } from "./db/connectDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", contentRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    connectDB();
}); 
