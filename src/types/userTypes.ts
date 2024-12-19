import { Document } from 'mongoose';

// Define the structure of the user document
export interface UserType extends Document {
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    lastLogin: Date;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
