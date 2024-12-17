import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(express.json());
app.use("/api/v1", authRoutes);

