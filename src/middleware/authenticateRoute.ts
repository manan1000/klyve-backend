import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateRoute = (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.cookies.token;

    try {

        if (!token) {
            res.status(401).json({ message: "Unauthenticated" });
            return;
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        if (!decodedValue) {
            res.status(401).json({ message: "Unauthenticated" });
            return;
        }

        //@ts-ignore
        req.userId = decodedValue?.userId;
        next();

    } catch (error) {
        console.error("Verify Token Error: ", error);
        res.status(401).json({ success: false, message: "Unauthenticated" });
        return;
    }
}