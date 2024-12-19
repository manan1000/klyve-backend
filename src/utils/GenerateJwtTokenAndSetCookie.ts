import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const GenerateJwtTokenAndSetCookie = (res:Response, userId: string) => {

    const jwtToken =  jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

export default GenerateJwtTokenAndSetCookie;