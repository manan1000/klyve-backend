import mongoose from "mongoose";
import { UserType } from "../types/userTypes";


const userSchema = new mongoose.Schema<UserType>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date }
},{timestamps: true});

export const User = mongoose.model<UserType>("User", userSchema);