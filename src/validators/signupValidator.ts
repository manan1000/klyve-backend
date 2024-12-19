import { z } from "zod";

export const signupValidator = z.object({
    email: z.string()
        .email("Invalid email format")
        .nonempty("Email is required"),

    username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(255, "Username cannot exceed 255 characters")
        .nonempty("Username is required"),

    password: z.string()
        .min(8, "Password must be at least 6 characters long")
        .max(255, "Password cannot exceed 255 characters")
        .nonempty("Password is required")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, `Password must contain at least one of these special character - [ ! @ # $ % ^ & * ( ) , . ? " : { } | < > ]`)
});