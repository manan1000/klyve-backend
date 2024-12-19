import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";

import { User } from '../models/User';
import { UserType } from '../types/userTypes';
import { signupValidator } from '../validators/signupValidator';
import { signupData } from '../types/authTypes';


export const signup = async (req: Request, res: Response) => {
    const { email, username, password }: signupData = req.body;
    try {

        // Validate the request body
        signupValidator.parse({ email, username, password });

        // If the request body is valid, proceed with the signup process

        // ... check if the user already exists
        const userAlreadyExists: UserType | null = await User.findOne({ email });
        if (userAlreadyExists) {
            res.status(409).json({ success: false, message: 'User already exists!' });
            return;
        }

        // ... create a new user
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: UserType = new User({
            email,
            username,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully!" });
        return;

    } catch (error){

        console.error("Error during signup:", error);
        if( error instanceof Error){
            //@ts-ignore
            res.status(500).json({ success: false, message: "User signup failed", error: error.issues[0].message });
            return;
        } else {
            res.status(500).json({ success: false, message: "Unknown error occurred during signup." });
            return;
        }
    }
};
