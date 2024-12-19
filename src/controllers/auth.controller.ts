import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

import { User } from '../models/User';
import { UserType } from '../types/userTypes';
import { signupValidator } from '../validators/signupValidator';
import { signinData, signupData } from '../types/authTypes';
import GenerateVerificationToken from '../utils/GenerateVerificationToken';
import GenerateJwtTokenAndSetCookie from '../utils/GenerateJwtTokenAndSetCookie';
import { passwordValidator } from '../validators/passwordValidator';


dotenv.config();

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
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken: string = GenerateVerificationToken();
        const newUser: UserType = new User({
            email,
            username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        // Save the new user to the database
        await newUser.save();

        //// send vefification email ////

        res.status(201).json({ success: true, message: "User created successfully!" });
        return;

    } catch (error) {

        console.error("Error during signup:", error);
        if (error instanceof Error) {
            //@ts-ignore
            res.status(500).json({ success: false, message: "User signup failed", error: error.issues[0].message });
            return;
        } else {
            res.status(500).json({ success: false, message: "Unknown error occurred during signup." });
            return;
        }
    }
};


export const signin = async (req: Request, res: Response) => {
    const { email, password }: signinData = req.body;
    try {

        // check if the user exists
        const user: UserType | null = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found!" });
            return;
        }

        // ... check if the password is correct
        const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ success: false, message: "Incorrect credentials!" });
            return;
        }

        GenerateJwtTokenAndSetCookie(res, user._id as string);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ success: true, message: "User signed in successfully!" });
        return;


    } catch (error) {

        console.error("Error during signup:", error);
        if (error instanceof Error) {
            //@ts-ignore
            res.status(500).json({ success: false, message: "User signin failed", error: error.issues[0].message });
            return;
        } else {
            res.status(500).json({ success: false, message: "Unknown error occurred during signin." });
            return;
        }
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out successfully!" });
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { verificationToken } = req.params;
    try {


    } catch (error) {

    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {

        const user: UserType | null = await User.findOne({ email });
        if (!user) {
            res.send(404).json({ success: false, message: "User not found!" });
            return;
        }

        // ... generate a reset password token
        const resetPasswordToken: string = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpiresAt: Date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();

        const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

        // ... send the reset password email

        res.status(200).json({ success: true, message: "Reset password email sent successfully!" });

    } catch (error) {

        console.error("Error during signup:", error);
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: "Forgot password failed", error });
            return;
        } else {
            res.status(500).json({ success: false, message: "Unknown error occurred during reset password." });
            return;
        }
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const password: string= req.body.password;

    try {

        passwordValidator.parse(password);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            res.send(404).json({ success: false, message: "Invalid or expired token!" });
            return;
        }

        const hashedPassword: string = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();


        //// send password reset successful email ////


        res.status(200).json({ success: true, message: "Password reset successfully!" });

    } catch (error) {

        console.error("Error during signup:", error);
        if (error instanceof Error) {
            //@ts-ignore
            res.status(500).json({ success: false, message: "User password reset failed", error: error.issues[0].message });
            return;
        } else {
            res.status(500).json({ success: false, message: "Unknown error occurred during resetting password." });
            return;
        }
    }
}